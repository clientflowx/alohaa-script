// custom-script.js

console.log("script to inject alohaa logic initiated");
let isAllocaBtnInserted = false;
let handleConversationItemClickTimerId = "";
let allohaManageComponentInserted = false;
const backendEndPointUrl = "https://cfx-mono-production.up.railway.app";
// const backendEndPointUrl = "http://localhost:8001";

const checkForValidUserFromCache = () => {
    console.log("Fetching Alloha list from cache",window.allohaList.includes(window.locationUserId));
    return window.allohaList.includes(window.locationUserId);
};

const fetchAllohaList = async () => {
    try {
        const apiUrl = `${backendEndPointUrl}/api/crmalloha/get-alloha-subaccounts`; // Replace with your actual API URL
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

        const data = await response.json();

        if (data?.data?.data) {
            const list = data.data.data;
            console.log("allohadatalist===", list);
            window.allohaList = list.map((item) => item?.locationId);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error in fetchAllohaList:", error.message);
        return false;
    }
};

const isValidAllohaUser = async () => {
    try {
        if (window.allohaList?.length > 0) {
            return checkForValidUserFromCache();
        }

        const hasFetchedAllohaList = await fetchAllohaList();
        if (hasFetchedAllohaList) {
            return checkForValidUserFromCache();
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error in isValidAllohaUser:", error.message);
        return false;
    }
};

// Populate valid Alloha list and trigger actions
setTimeout(async () => {
    const hasAccessToAlloha = await isValidAllohaUser();
    if (hasAccessToAlloha) {
        triggerEveryThing(); // activateAllTheFn
    } else {
        console.log("No access, sitting silent");
    }
}, 2000);

// find email of current user
// add listener on settings btn -> add listener on integration btn
// add listener on conversation btn
// insert alloha call btn
// insert manage alohaa tab in integrations section
function triggerEveryThing() {
    const fetchEmailOfCurrentUser = () => {
        const fetchEmailTimerId = setInterval(() => {
            const userInfo = document.querySelector(".user-info-card");
            if (userInfo) {
                const userCard = userInfo.getElementsByClassName("text-xs truncate");
                if (userCard) {
                    const userEmail = userCard[0].textContent;
                    console.log("userEmail", userEmail);
                    window.userEmail = userEmail;
                    clearInterval(fetchEmailTimerId);
                }
            }
        }, 2000);
    };

    // call on load
    fetchEmailOfCurrentUser();

    const attachEventListenerToBackBtn = () => {
        const targetBackBtnTimer = setInterval(() => {
            const backBtn = document.getElementById("backButtonv2");
            console.log("inside back btn", backBtn);
            if (backBtn) {
                backBtn.addEventListener("click", () => {
                    // manageConversationBtnClick();
                    //   insertAllohaCallBtn();
                    triggerEveryThing();
                });
                clearInterval(targetBackBtnTimer);
            }
        }, 1000);
    };

    const addListenerToSettingBtn = async () => {
        const btnSettings = document.getElementById("sb_settings");

        if (btnSettings) {
            console.log("btn", btnSettings);
            btnSettings.addEventListener("click", () => {
                // if (window.locationUserId === "FQ2QW4FaaR2EA12eaHnC") {
                console.log(
                    "called to add event listener to integration btn for alloha"
                );
                attachEventListenerToIntegrationBtn();
                // done to restart my event listeners for insert alloha
                attachEventListenerToBackBtn();
                // }
            });
            // once event listener attached then stop setInterval fn for setting btn
            clearInterval(settingBtnTimer);
        }
    };

    const settingBtnTimer = setInterval(addListenerToSettingBtn, 2000);

    const attachEventListenerToIntegrationBtn = () => {
        const integrationBtnTimer = setInterval(() => {
            // Add event listener after 15 seconds
            const btnIntegration = document.getElementById("sb_integrations");

            if (btnIntegration) {
                console.log("btn", btnIntegration);
                btnIntegration.addEventListener("click", () => {
                    console.log(
                        "window.locationUserId",
                        window.locationUserId,
                        window.location.href
                    );
                    // if (window.locationUserId === "FQ2QW4FaaR2EA12eaHnC") {
                    console.log("called to insert manage alloha tab");
                    insertManageAllohaTab();
                    // }
                });
                // once event listener attached then stop setInterval fn for integration btn
                clearInterval(integrationBtnTimer);
            }
        }, 2000);
    };

    // insert a div element in integration tab
    const insertManageAllohaTab = () => {
        console.log("123444");
        setTimeout(() => {
            const outer = document.getElementsByClassName(
                "hl_settings--body hl_v2_stettings--body hl_without-topbar"
            );
            const inner = outer[0].getElementsByTagName("div")[1];
            const isManageAlohaaTabAlreadyInsered = document.getElementById("manage-alohaa-tab")
            if (inner && !isManageAlohaaTabAlreadyInsered) {
                console.log("here");
                const manageAlohaaTab = document.createElement("div");
                manageAlohaaTab.classList.add('col-12');
                manageAlohaaTab.id = 'manage-alohaa-tab'
                manageAlohaaTab.innerHTML = `<iframe id="allohaStats" src="https://integration-cfx.netlify.app/highlevel/alohaa?locationId=${window.locationUserId}" style="width:450px;height:450px;" />`
                inner.appendChild(manageAlohaaTab);
                allohaManageComponentInserted = true;
                // clearInterval(insertManageAllohaTabTimer);
            }
        }, 10000);
    };

    var manageAllohaPageDesiredUrlPattern =
        /^https:\/\/app\.clientflowx\.com\/v2\/location\/[A-Za-z0-9]+\/settings\/integrations\/list$/;

    // Check if the current URL matches the desired URL pattern
    if (manageAllohaPageDesiredUrlPattern.test(window.location.href)) {
        // Your code to run when the URLs match
        console.log("URL matches the pattern for manage");
        insertManageAllohaTab();
    }

    const findMobileNumberOfCurrentUser = () => {
        // const mobileNumerTimer = setInterval(() => {
        const mobileNumberOfUser = document.getElementsByClassName(
            "truncate text-sm font-normal text-gray-600 hover:text-primary-700 cursor-pointer"
        )[0]?.innerHTML;
        console.log("mobile===", mobileNumberOfUser);
        if (mobileNumberOfUser) {
            const formattedNumber = mobileNumberOfUser
                .replace(/^(\+91\s*)/g, "")
                .replace(/\s/g, "");
            window.currentUserMobie = formattedNumber;
            // clearInterval(mobileNumerTimer);
            return true;
        } else {
            window.alert("Mobile Number not found");
            return false;
        }
    };


    // Insert Alohaa Call Btn Section ================================================================================================================
    // ===============================================================================================================================================
    const addEventListenerToConversationItemsClick = () => {
        const timerId = setInterval(() => {
            const conversationList = document.querySelector("#conversation-list")
            if (conversationList) {
                conversationList.addEventListener("click", () => {
                    insertAllohaCallBtn();
                })
                clearInterval(timerId)
            }
        }, 1000)
    }


    const addEventListenerToConversationSectionTopBar = () => {
        const timerId = setInterval(() => {
            const conversationNavItem = document.querySelector("#conversations > div > div.hl_conversations--messages-list-v2.relative.border-r.border-gray-200 > div > div:nth-child(1) > div > nav")
            if (conversationNavItem) {
                conversationNavItem.addEventListener("click", () => {
                    insertAllohaCallBtn();
                })
                clearInterval(timerId)
            }
        }, 1000)
    }


    function addEventListenerToAllohaCallBtn() {
        const allohaCallBtn = document.querySelector(".alloha-call-btn");
        allohaCallBtn.addEventListener("click", async () => {
            if (!findMobileNumberOfCurrentUser()) {
                return null;
            }
            const payload = {
                // didNumber: '918069738302',
                // callerNumber: '8882375101',
                receiverNumber: window.currentUserMobie,
                mobileNumberOfUser: window.currentUserMobie,
                locationId: window.locationUserId,
                email: window.userEmail,
            };
            console.log("alloha api", payload);
            const config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // add any other headers you need
                },
                body: JSON.stringify(payload),
            };
            try {
                console.log("alloha call btn clicked=======");
                const apiUrl = backendEndPointUrl;
                const response = await fetch(
                    `${apiUrl}/api/customer/alloha-make-call`,
                    config
                );

                const data = await response.json();
                // handle the data from the successful response
                console.log("calldata", data);
                if (data?.success)
                    window.alert("Call Connected...")
                else window.alert("Some Error Occurred")
            } catch (error) {
                // handle any errors during the request
                console.error("Error:", error.message);
            }
        });
    }

    function insertAllohaCallBtn() {
        // Find the existing div with class 'message-header-actions' every 5 seconds
        const timeId = setInterval(() => {
            const existingDiv = document.querySelector("#new-crp--contacts > div.flex.flex-col.items-center.pt-\\[24px\\] > div.w-full.pl-\\[19px\\].pr-\\[17px\\].py-\\[8px\\]")
            if (existingDiv) {
                // Find the child div with class 'button-group'
                const buttonGroupDiv = document.querySelector("#new-crp--contacts > div.flex.flex-col.items-center.pt-\\[24px\\] > div.w-full.pl-\\[19px\\].pr-\\[17px\\].py-\\[8px\\] > div")
                // check if alohaa call btn is already inserted
                const isAlohaaCallBtnAlreadyInserted = document.getElementById("alohaa-make-call-btn");
                if (buttonGroupDiv) {
                    // if alohaa already inserted
                    clearInterval(timeId);
                    if (isAlohaaCallBtnAlreadyInserted) {
                        // Use clearInterval instead of clearTimeout
                        return;
                    }
                    // hide twillio btn in profile tab
                    const twilllioBtnToHide = document.querySelector("#new-crp--contacts > div.flex.flex-col.items-center.pt-\\[24px\\] > div.w-full.pl-\\[19px\\].pr-\\[17px\\].py-\\[8px\\] > div > div:nth-child(1)")
                    if (twilllioBtnToHide) {
                        twilllioBtnToHide.style.display = "none";
                    }
                    // Get the second button in the button group
                    // const secondButton = document.querySelector(
                    //     ".button-group button:nth-child(1)"
                    // );
                    // console.log("second btn====", secondButton);
                    // // Remove the rounded-l-md class
                    // secondButton.classList.remove("rounded-l-md");

                    // Create a new button
                    const newButton = document.createElement("button");
                    newButton.id = "alohaa-make-call-btn"
                    newButton.setAttribute("type", "button");
                    newButton.classList.add(
                        "alloha-call-btn",
                        "flex",
                        "items-center",
                        "h-[24px]",
                        "new-crp--contacts--transition",
                        "justify-center",
                        "w-[26px]",
                        "rounded-full",
                        "bg-gray-200",
                        "cursor-pointer"
                    );
                    // newButton.style.paddingLeft = "15px";
                    // newButton.style.background = "gray";

                    // Set button content
                    newButton.innerHTML =
                        '<span><img src="https://res.cloudinary.com/dtqzhg98l/image/upload/v1705251766/Alohaa_orqfaa.png" class="h-[14px] w-[14px] new-crp--contacts--transition" /></span>'; // You can customize the text

                    // Insert the new button as the first child inside the 'button-group' div
                    buttonGroupDiv.insertBefore(newButton, buttonGroupDiv.firstChild);
                    isAllocaBtnInserted = true;
                    addEventListenerToAllohaCallBtn();
                }
            }
        }, 200);
    }


    const manageConversationBtnClick = () => {
        const converseTimerId = setInterval(() => {
            // Add event listener after each 5 seconds
            const msgBtn = document.getElementById("sb_conversations");

            if (msgBtn) {
                console.log("msgbtn", msgBtn);
                msgBtn.addEventListener("click", () => {
                    console.log(
                        "window.locationUserId",
                        window.locationUserId,
                        window.location.href
                    );
                    console.log("found inside msg====");
                    insertAllohaCallBtn();

                    // attach listener on chat list item to get email
                    addEventListenerToConversationItemsClick()
                    addEventListenerToConversationSectionTopBar()

                });
                clearInterval(converseTimerId);
            }
        }, 5000);
    };

    // call fn to add event listener on conversation btn
    manageConversationBtnClick();


    // To handle case for page reload
    var callAllohaPageDesiredUrlPattern =
        /https:\/\/app\.clientflowx\.com\/v2\/location\/[A-Za-z0-9]+\/conversations\/conversations\/[A-Za-z0-9]+/;

    // Check if the current URL matches the desired URL pattern
    if (callAllohaPageDesiredUrlPattern.test(window.location.href)) {
        // Your code to run when the URLs match
        console.log("URL matches the pattern for call");
        insertAllohaCallBtn();
        addEventListenerToConversationItemsClick();
        addEventListenerToConversationSectionTopBar();
    }


    // phase 2 changes start =====================================

    const insertCallReportingTabForAlloha = () => {
        const insertCallInfoBtnForAllohaTimerId = setInterval(() => {
            // attachEventListenerToCallInfoAllohaBtn();
            const callReportingDashboard = document.querySelector(
                "#call-reporting-dashboard"
            );
            if (callReportingDashboard) {
                callReportingDashboard.innerHTML = `<iframe
                src="https://integration-cfx.netlify.app/highlevel/alohaa/call-info?locationId=${window.locationUserId}" 
                class="w-full h-screen mb-6"
              ></iframe>`;
                clearInterval(insertCallInfoBtnForAllohaTimerId);
            }
        }, 100);
    };

    const attachEventListenerToCallReportingTab = () => {
        console.log("attachEventListener");
        const attachEventListenerToCallReportingTabTimer = setInterval(() => {
            const callReportingBtn = document.querySelector("#tb_call-reporting");
            if (callReportingBtn) {
                callReportingBtn.addEventListener("click", () => {
                    // attachBtnToCallReportingTab();
                    insertCallReportingTabForAlloha()
                });
                clearInterval(attachEventListenerToCallReportingTabTimer);
            }
        }, 100);
    };
    const attachEventListenerToReportingBtn = () => {
        const attachEventListenerToReportingBtnTimer = setInterval(() => {
            const reportingBtn = document.querySelector("#sb_reporting");
            console.log("Reporting", reportingBtn);
            if (reportingBtn) {
                reportingBtn.addEventListener("click", () => {
                    attachEventListenerToCallReportingTab();
                });
                clearInterval(attachEventListenerToReportingBtnTimer);
            }
        }, 100);
    };
    attachEventListenerToReportingBtn();


    // oppurtunities section

    const makeAlohaaCall = async (mobileNumberOfReceiver) => {
        if (!mobileNumberOfReceiver) {
            window.alert("Mobile Number Not Found")
            return;
        }
        const formattedReceiverNumber = mobileNumberOfReceiver
            .replace(/^(\+91\s*)/g, "")
            .replace(/\s/g, "");
        const payload = {
            // didNumber: '918069738302',
            // callerNumber: '8882375101',
            receiverNumber: formattedReceiverNumber,
            mobileNumberOfUser: formattedReceiverNumber,
            locationId: window.locationUserId,
            email: window.userEmail,
        };
        console.log("alloha api", payload);
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // add any other headers you need
            },
            body: JSON.stringify(payload),
        };
        try {
            console.log("alloha call btn clicked=======");
            const apiUrl = backendEndPointUrl;
            const response = await fetch(
                `${apiUrl}/api/customer/alloha-make-call`,
                config
            );

            const data = await response.json();
            // handle the data from the successful response
            window.alert("Call Connected...")
            console.log("calldata", data);
        } catch (error) {
            // handle any errors during the request
            console.error("Error:", error.message);
        }
    }


    const attachEventListenerToMakeCallBtnInOpportunitiesCard = () => {
        console.log("attachEventListenerToMakeCallBtnInOpportunitiesCard")
        const attachEventListenerToMakeCallBtnInOppCardTimerId = setInterval(() => {
            const opportunitiesCardMobileNumberField = document.querySelector("#ContactPhone > div.n-input-wrapper > div.n-input__input > input");
            const makeCallThroughAlohaaOpportunitiesBtn = document.getElementById("alohaa-make-call-opportunities-btn");
            if (opportunitiesCardMobileNumberField && makeCallThroughAlohaaOpportunitiesBtn) {
                console.log("make call through alohaa in opportunities", opportunitiesCardMobileNumberField, makeCallThroughAlohaaOpportunitiesBtn)
                const mobileNumberOfOpportunitiesCard = opportunitiesCardMobileNumberField.value;
                clearInterval(attachEventListenerToMakeCallBtnInOppCardTimerId);
                makeCallThroughAlohaaOpportunitiesBtn.addEventListener("click", (ev) => {
                    console.log("mobileNumberField", mobileNumberOfOpportunitiesCard);
                    makeAlohaaCall(mobileNumberOfOpportunitiesCard);
                })
            }
        }, 50)
    }

    const addBtnToMakeCallThroughAlohaa = () => {
        const addBtnToMakeCallThroughAlohaaTimerId = setInterval(() => {
            const opportunitiesCardMobileNumberField = document.querySelector("#opportunitiesForm > div:nth-child(2) > div > div.n-form-item-blank");
            const isAlohaaCallBtnAlreadyInserted = document.getElementById("alohaa-make-call-opportunities-btn")
            if (opportunitiesCardMobileNumberField) {
                if (isAlohaaCallBtnAlreadyInserted) {
                    clearInterval(addBtnToMakeCallThroughAlohaaTimerId);
                    return;
                }
                opportunitiesCardMobileNumberField.classList.remove('n-form-item-blank')
                opportunitiesCardMobileNumberField.classList.add('flex','items-center')
                const newButton = document.createElement("button");
                newButton.id = "alohaa-make-call-opportunities-btn"
                newButton.setAttribute("type", "button");
                newButton.classList.add(
                    "alloha-call-opportunities-btn",
                    "flex",
                    "items-center",
                    "px-2.5",
                    "py-1",
                    "mx-2"
                );
                // newButton.style.background = "gray";

                // Set button content
                newButton.innerHTML =
                    '<span><img src="https://res.cloudinary.com/dtqzhg98l/image/upload/v1705251766/Alohaa_orqfaa.png" style="height:25px;"/></span>'; // You can customize the text
                opportunitiesCardMobileNumberField.appendChild(newButton);
                attachEventListenerToMakeCallBtnInOpportunitiesCard();
                clearInterval(addBtnToMakeCallThroughAlohaaTimerId);
            }
        }, 50)
    }


    const attachEventListenerToOpportunitiesCards = () => {
        const attachEventListenerToOpportunitiesCardsTimerId = setInterval(() => {
            const opportunitiesCard = document.getElementsByClassName("opportunitiesCard borderColor mb-2 hl-card")
            if (opportunitiesCard.length > 0) {
                for (let i = 0; i < opportunitiesCard.length; i++) {
                    opportunitiesCard[i].addEventListener("click", (ev) => {
                        // findMobileNumberOfOpportunitiesUser()
                        addBtnToMakeCallThroughAlohaa()
                    })
                }
                clearInterval(attachEventListenerToOpportunitiesCardsTimerId);
            }
        }, 150)
    }

    const attachEventListenerToOpportunitiesTab = () => {
        console.log("opportunitiesTab script started running")
        const attachEventListenerToOpportunitiesTabTimerId = setInterval(() => {
            const opportunitiesTab = document.getElementById("sb_opportunities");
            if (opportunitiesTab) {
                console.log("opportunitiesTab", opportunitiesTab)
                opportunitiesTab.addEventListener("click", () => {
                    attachEventListenerToOpportunitiesCards();
                })
                clearInterval(attachEventListenerToOpportunitiesTabTimerId);
            }
        }, 100)
    }
    // called on load
    attachEventListenerToOpportunitiesTab()



    // call info alloha page desired url pattern
    const callInfoAllohaPageDesiredUrlPattern =
        /^https:\/\/app\.clientflowx\.com\/v2\/location\/[A-Za-z0-9]+\/reporting\/call_stats$/;

    // Check if the current URL matches the desired URL pattern
    if (callInfoAllohaPageDesiredUrlPattern.test(window.location.href)) {
        // Your code to run when the URLs match
        console.log("URL matches the pattern for call info");
        // insertCallInfoTabForAlloha();
        insertCallReportingTabForAlloha();
    }

    // phase 2 end ========================================================

    window.addEventListener("popstate", function (event) {
        console.log("Page URL changed:", window.location.href);
        // Your code to handle URL change
    });


    const regularCallingFn = () => {
        setInterval(() => {
            const alohaaBtn = document.getElementById('alohaa-make-call-btn');
            if (!alohaaBtn) insertAllohaCallBtn();
            addBtnToMakeCallThroughAlohaa()
        }, 200)
    }

    regularCallingFn();
}
