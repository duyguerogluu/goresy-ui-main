export const isAuthorized = (authorities, authority) => {
    return !!authorities.find(ownedAuthority => (ownedAuthority.authority === authority));
}
