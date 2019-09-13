
// Wrap effect for use in subscriptions without payload
export const WrapEffects = fx => state => [state, fx];