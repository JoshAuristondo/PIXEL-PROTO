import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { reducer } from './reducer';
import { buildInitialState, DEMO_2FA_CODE, STAFF_ROLES, TWO_FA_ROLES } from './mockData';
import { currentUser } from './selectors';
import { cleanRut } from './utils';

/*
 * STORE CONTEXT — "base de datos" simulada del prototipo.
 * Todo el estado (usuarios, productos, claves, pedidos, auditoría…) vive en este
 * contexto y se persiste en localStorage para que sobreviva a recargas.
 * "Reiniciar datos demo" vuelve a la semilla de mockData.js.
 */

const STORAGE_KEY = 'pixelgamers.store.v1';

const load = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.v === 1) return parsed;
        }
    } catch {
        /* storage no disponible o corrupto: se usa la semilla */
    }
    return buildInitialState();
};

const StoreCtx = createContext(null);

export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, undefined, load);
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            /* sin persistencia: el prototipo sigue funcionando en memoria */
        }
    }, [state]);

    const notify = useCallback((msg, tone = 'ok') => {
        const id = Math.random().toString(36).slice(2);
        setToasts((t) => [...t, { id, msg, tone }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
    }, []);

    const api = useMemo(() => {
        const d = (type, payload = {}) => dispatch({ type, ts: Date.now(), ...payload });
        return {
            dispatch: d,

            /** Valida credenciales. Devuelve { ok, user, needs2fa, needsBranch, error } */
            authenticate(identifier, password) {
                const st = stateRef.current;
                const id = identifier.trim().toLowerCase();
                const injection = /('|--|;|<script|union\s+select)/i.test(identifier);
                if (injection) {
                    d('LOGIN_FAIL', { injection: true });
                    return { ok: false, error: 'Entrada inválida bloqueada por el filtro de seguridad.' };
                }
                const user = st.users.find((u) => u.email.toLowerCase() === id || (cleanRut(identifier).length > 6 && cleanRut(u.rut || '') === cleanRut(identifier)));
                if (!user || user.password !== password) {
                    d('LOGIN_FAIL');
                    return { ok: false, error: 'Credenciales incorrectas.' };
                }
                if (!user.active) return { ok: false, error: 'Cuenta suspendida. Contacta a un administrador.' };
                return {
                    ok: true, user,
                    needs2fa: TWO_FA_ROLES.includes(user.role) && st.policies.twoFa,
                    needsBranch: user.role === 'vendedor',
                    mustChange: !!user.mustChange,
                };
            },
            check2fa: (code) => code === DEMO_2FA_CODE,
            login: (userId, branchId) => d('LOGIN', { userId, branchId }),
            logout: () => d('LOGOUT'),
            isStaffRole: (r) => STAFF_ROLES.includes(r),

            register: (user) => d('REGISTER', { user }),
            updateProfile: (userId, patch) => d('UPDATE_PROFILE', { userId, patch }),
            changePassword: (userId, password) => d('CHANGE_PASSWORD', { userId, password }),
            subscribe: (email, value, branchId) => d('SUBSCRIBE', { email, value, branchId }),

            addToCart: (productId, qty = 1) => d('CART_ADD', { productId, qty }),
            setQty: (productId, qty) => d('CART_QTY', { productId, qty }),
            removeFromCart: (productId) => d('CART_REMOVE', { productId }),
            clearCart: () => d('CART_CLEAR'),
            setDelivery: (patch) => d('CART_DELIVERY', { patch }),
            renewCart: () => d('CART_RENEW'),

            placeOrder(payload) {
                const orderId = `PG-${String(Date.now()).slice(-6)}`;
                d('PLACE_ORDER', { orderId, ...payload });
                return orderId;
            },
            rejectPayment: (payload) => d('PAYMENT_REJECTED', { orderId: `PG-${String(Date.now()).slice(-6)}`, ...payload }),

            setTracking: (orderId, trackingId, courier) => d('SET_TRACKING', { orderId, trackingId, courier }),
            advanceShip: (orderId) => d('ADVANCE_SHIP', { orderId }),
            labelPrinted: (orderId) => d('LABEL_PRINTED', { orderId }),
            pickupDeliver: (orderId, rut, signature) => d('PICKUP_DELIVER', { orderId, rut, signature }),

            receiveStock: (p) => d('STOCK_RECEIVE', p),
            requestAdjust: (p) => d('ADJUST_REQUEST', p),
            decideAdjust: (id, approve) => d('ADJUST_DECIDE', { id, approve }),
            setThreshold: (productId, value) => d('SET_THRESHOLD', { productId, value }),
            requestReplenish: (productId, branchId) => d('REPLENISH_REQUEST', { productId, branchId }),

            importKeys: (rows, errors, filename) => d('KEYS_IMPORT', { rows, errors, filename }),
            auditKeys: () => d('KEYS_AUDIT_SCAN'),

            posSale: (sale) => d('POS_SALE', { sale }),
            setOffline: (value) => d('OFFLINE_SET', { value }),
            syncPos: () => d('POS_SYNC'),

            requestTransfer: (p) => d('TRANSFER_REQUEST', p),
            decideTransfer: (id, approve) => d('TRANSFER_DECIDE', { id, approve }),
            receiveTransfer: (id) => d('TRANSFER_RECEIVE', { id }),

            createUser: (data) => d('USER_CREATE', { data }),
            toggleUser: (userId) => d('USER_TOGGLE', { userId }),
            resetUser: (userId) => d('USER_RESET', { userId }),
            setUserBranches: (userId, branches) => d('USER_BRANCHES', { userId, branches }),
            setPermission: (role, module, perm, value) => d('RBAC_SET', { role, module, perm, value }),

            createCampaign: (campaign) => d('CAMPAIGN_CREATE', { campaign }),
            sendCampaign: (id, sent) => {
                const opens = Math.round(sent * (0.55 + Math.random() * 0.25));
                const clicks = Math.round(opens * (0.3 + Math.random() * 0.25));
                d('CAMPAIGN_SEND', { id, sent, opens, clicks });
            },
            addWaitlist: (productId, email) => d('WAITLIST_ADD', { productId, email }),
            addReview: (r) => d('REVIEW_ADD', r),

            runHealth() {
                const st = stateRef.current;
                const rolls = {};
                [...st.services, ...st.couriers].forEach((x) => {
                    rolls[x.id] = { latency: Math.max(8, Math.round((x.latency || 300) * (0.85 + Math.random() * 0.3))), success: Math.round((98.4 + Math.random() * 1.6) * 100) / 100 };
                });
                d('HEALTH_RUN', { rolls });
            },
            toggleDown: (kind, id) => d('HEALTH_DOWN_TOGGLE', { kind, id }),
            toggleCourier: (id) => d('COURIER_TOGGLE', { id }),
            failover: () => d('FAILOVER'),
            patchInfra: (patch) => d('INFRA_PATCH', { patch }),
            tickInfra: () => d('INFRA_TICK', { noise: Math.random() - 0.5 }),
            backup: () => d('DRP_BACKUP'),
            restore: () => d('DRP_RESTORE'),

            resetDemo: () => d('RESET', { state: buildInitialState() }),
        };
    }, []);

    const user = currentUser(state);
    const value = useMemo(() => ({ state, api, user, notify }), [state, api, user, notify]);

    return (
        <StoreCtx.Provider value={value}>
            {children}
            <div className="px-toasts" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} className={`px-toast px-toast--${t.tone}`}>
                        {t.msg}
                    </div>
                ))}
            </div>
        </StoreCtx.Provider>
    );
}
