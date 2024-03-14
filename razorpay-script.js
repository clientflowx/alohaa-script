// custom-script.js

console.log("script to inject razorpay logic initiated");

const razorpayBackendEndPointUrl = "https://cfx-mono-production-5ec7.up.railway.app";


const checkForValidUserFromRazorPayAccountListCache = () => {
    return window.razorpayList.includes(window.locationUserId);
};

const fetchRazorpayList = async () => {
    try {
        const apiUrl = `${razorpayBackendEndPointUrl}/api/razorpay/fetch-all-razorpay-accounts`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Add any additional headers if needed
            },
            // You can add credentials: 'include' if you need to include cookies in the request
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { data } = await response.json();

        if (data) {
            const list = data;
            window.razorpayList = list.map((item) => item?.locationId);
            console.log("window.razorpaylist", window.razorpayList)
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error in fetchAllohaList:", error.message);
        return false;
    }
};

const isValidRazorpayUser = async () => {
    try {
        if (window.razorpayList?.length > 0) {
            return checkForValidUserFromRazorPayAccountListCache();
        }

        const hasFetchedRazorpayList = await fetchRazorpayList();
        if (hasFetchedRazorpayList) {
            return checkForValidUserFromRazorPayAccountListCache();
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error in isValidRazorpayUser:", error.message);
        return false;
    }
};

// Populate valid Alloha list and trigger actions
async function initiateRazorpayScript() {
    const hasAccessToRazorpay = await isValidRazorpayUser();
    if (hasAccessToRazorpay) {
        triggerRazorpayLogic(); // activateAllTheFn
    } else {
        console.log("No access to Razorpay, sitting silent");
    }
}


function triggerRazorpayLogic() {
    console.log("This Sub account has access to razorpay")
    const invoicesPageRegex = /^https:\/\/app\.clientflowx\.com\/v2\/location\/[a-zA-Z0-9]+\/payments\/invoices/


    function insertInoviceTab() {
        console.log("fn to insert invoice tab initiated");
    }

    window.addEventListener("routeChangeEvent", function () {
        // check if it is a invoice page url
        if (invoicesPageRegex.test(window.location.href)) {
            insertInoviceTab();
        }
    });
}


// initial script
initiateRazorpayScript()