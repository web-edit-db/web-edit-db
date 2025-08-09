import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner"

function PWAReload() {
    // send a sonar notification when the service worker is registered
    const { updateServiceWorker } = useRegisterSW({
        onRegisteredSW(swUrl) {
            console.log("SW registered: ", swUrl);
        },
        onRegisterError(error) {
            console.log("SW registration error: ", error);
        },
        onOfflineReady() {
            console.log("Ready to work offline");
            toast.success("Ready to work offline");
        },
        onNeedRefresh() {
            toast.info("New version available, click to update", {
                action: {
                    label: "Update",
                    onClick: () => {
                        updateServiceWorker();
                    },
                },
            });
        },
    });

    return null;
}

export default PWAReload;