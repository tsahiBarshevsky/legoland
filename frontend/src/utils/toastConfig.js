import { CartToast } from "../components";

const toastConfig = {
    cartToast: ({ props }) => (
        <CartToast props={props} />
    )
};

export { toastConfig };