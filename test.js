// custom-script.js

console.log("script to inject alohaa logic initiated");
let isAllocaBtnInserted = false;
let handleConversationItemClickTimerId = "";
let allohaManageComponentInserted = false;
const backendEndPointUrl = "https://test1-production-00cc.up.railway.app";
// const backendEndPointUrl = "http://localhost:8001";

const checkForValidUserFromCache = () => {
  console.log("Fetching Alloha list from cache");
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
}, 1000);

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
      if (inner) {
        console.log("here");
        inner.innerHTML += `<div class="col-12"><iframe id="allohaStats" src="https://clientflowx-app.netlify.app/highlevel/alloha/main?locationId=${window.locationUserId}" style="width:450px;height:350px;" /></div>`;
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

  // To handle case for page reload
  var callAllohaPageDesiredUrlPattern =
    /https:\/\/app\.clientflowx\.com\/v2\/location\/[A-Za-z0-9]+\/conversations\/conversations\/[A-Za-z0-9]+/;

  // Check if the current URL matches the desired URL pattern
  if (callAllohaPageDesiredUrlPattern.test(window.location.href)) {
    // Your code to run when the URLs match
    console.log("URL matches the pattern for call");
    insertAllohaCallBtn();
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
          // if (window.locationUserId === "FQ2QW4FaaR2EA12eaHnC") {
          console.log("found inside msg====");
          // if (!isAllocaBtnInserted) {
          insertAllohaCallBtn();
          // attach listener on chat list item to get email
          // attachListenerToListItemClick();
          // }
          // }
        });
        clearInterval(converseTimerId);
      }
    }, 5000);
  };

  // call fn to add event listener on conversation btn
  manageConversationBtnClick();

  function addEventListenerToAllohaCallBtn() {
    const allohaCallBtn = document.querySelector(".alloha-call-btn");
    allohaCallBtn.addEventListener("click", async () => {
      if (!findMobileNumberOfCurrentUser()) {
        window.alert("Mobile Number not found");
        return;
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
      } catch (error) {
        // handle any errors during the request
        console.error("Error:", error.message);
      }
    });
  }

  function insertAllohaCallBtn() {
    // Find the existing div with class 'message-header-actions' every 5 seconds
    const timeId = setInterval(() => {
      const existingDiv = document.querySelector(".message-header-actions");
      console.log("div===", existingDiv);

      if (existingDiv) {
        // Find the child div with class 'button-group'
        const buttonGroupDiv = existingDiv.querySelector(".button-group");

        if (buttonGroupDiv) {
          // Get the second button in the button group
          const secondButton = document.querySelector(
            ".button-group button:nth-child(1)"
          );
          console.log("second btn====", secondButton);
          // Remove the rounded-l-md class
          secondButton.classList.remove("rounded-l-md");

          // Create a new button
          const newButton = document.createElement("button");
          newButton.setAttribute("type", "button");
          newButton.classList.add(
            "alloha-call-btn",
            "flex",
            "inline-flex",
            "items-center",
            "px-2.5",
            "py-1",
            "border",
            "border-gray-300",
            "rounded-l-md"
          );
          newButton.style.paddingLeft = "15px";
          // newButton.style.background = "gray";

          // Set button content
          newButton.innerHTML =
            '<span><img src="https://res.cloudinary.com/dtqzhg98l/image/upload/v1705251766/Alohaa_orqfaa.png" style="height:20px;"/></span>'; // You can customize the text

          // Insert the new button as the first child inside the 'button-group' div
          buttonGroupDiv.insertBefore(newButton, buttonGroupDiv.firstChild);
          isAllocaBtnInserted = true;
          clearInterval(timeId); // Use clearInterval instead of clearTimeout
          addEventListenerToAllohaCallBtn();
        }
      }
    }, 5000);
  }

  // phase 2 changes start =====================================
  const viewAlohaaRecordsBtnsEventHandler = () => {
    const viewAlohaaBtn = document.getElementById("view-alohaa-btn");
    viewAlohaaBtn.addEventListener("click", () => {
      const toFind = document.getElementById("default-modal");
      if (toFind) {
        if (Array.from(toFind.classList).includes("hidden")) {
          viewAlohaaBtn.innerText = "View Alohaa Records";
          toFind.className =
            "overflow-x-hidden z-50 justify-center items-center w-full md:inset-0";
        } else viewAlohaaBtn.innerText = "Hide Alohaa Records";
        toFind.className =
          "hidden overflow-x-hidden z-50 justify-center items-center w-full md:inset-0";
      } else {
        const insertBeforeElement = document.querySelector(
          "#call-reporting-dashboard > div > div > div.w-vw.z-10.sticky.top-0.py-2\\.5.-mx-8.-mt-4.bg-gray-50"
        );
        const parentElement = document.querySelector(
          "#call-reporting-dashboard > div > div"
        );

        const callReportingModal = document.createElement("div");

        callReportingModal.className =
          "overflow-x-hidden z-50 justify-center items-center w-full md:inset-0";
        callReportingModal.setAttribute("id", "default-modal");
        callReportingModal.setAttribute("tabindex", "-1");
        callReportingModal.setAttribute("aria-hidden", "true");
        callReportingModal.innerHTML = `<iframe
            src="https://integration-cfx.netlify.app/highlevel/alohaa/call-info?locationId=${window.locationUserId}" 
            class="w-full h-screen"
          ></iframe>`;
        callReportingModal.className =
          "overflow-x-hidden z-50 justify-center items-center w-full md:inset-0";
        parentElement.insertBefore(callReportingModal, insertBeforeElement);
      }
    });
  };
  const attachBtnToCallReportingTab = () => {
    const attachBtnToCallReportingTabTimer = setInterval(() => {
      const insertDestination = document.querySelector(
        "#call-reporting-dashboard > div > div > div.hl-header > div > div:nth-child(2)"
      );
      console.log("insertDestination", insertDestination);
      if (insertDestination) {
        const viewAlohaaRecordsBtns = document.createElement("button");
        viewAlohaaRecordsBtns.className =
          "border-2 border-black/50 hover:bg-[#6C47FF] hover:bg-blue-700 hover:border-white hover:text-white md:py-2 px-3 py-2 rounded-lg text-black";
        viewAlohaaRecordsBtns.setAttribute(
          "data-modal-target",
          "default-modal"
        );
        viewAlohaaRecordsBtns.setAttribute(
          "data-modal-toggle",
          "default-modal"
        );
        viewAlohaaRecordsBtns.innerText = "View Alohaa Records";
        viewAlohaaRecordsBtns.id = "view-alohaa-btn";
        insertDestination.appendChild(viewAlohaaRecordsBtns);
        viewAlohaaRecordsBtnsEventHandler();
        console.log("callreporting", insertDestination);
        clearInterval(attachBtnToCallReportingTabTimer);
      }
    }, 100);
  };
  const attachEventListenerToCallReportingTab = () => {
    console.log("attachEventListener");
    const attachEventListenerToCallReportingTabTimer = setInterval(() => {
      const callReportingBtn = document.querySelector("#tb_call-reporting");
      if (callReportingBtn) {
        callReportingBtn.addEventListener("click", () => {
          attachBtnToCallReportingTab();
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

  // const attachEventListenerToCallInfoAllohaBtn = () => {
  //     const attachEventListenerToCallInfoAllohaBtnTimerId = setInterval(() => {
  //         const callInfoDetailBtn = document.querySelector(".callInfoAllohaBtn")
  //         const callReportingDashboard = document.querySelector("#call-reporting-dashboard")
  //         if (callInfoDetailBtn && callReportingDashboard) {
  //             console.log("callinfodetail", callInfoDetailBtn);
  //             callInfoDetailBtn.addEventListener("click", () => {
  //                 console.log("callReporting", callReportingDashboard);
  //                 callReportingDashboard.innerHTML = `<iframe src="http://localhost:3000/highlevel/alloha/call-info?locationId=${window.locationUserId}" style="width:80vw;height:78vh"></iframe>`
  //             })
  //         }
  //         clearInterval(attachEventListenerToCallInfoAllohaBtnTimerId)
  //     }, 100)
  // }

  // insert call info tab for alloha
  // const insertCallInfoTabForAlloha = () => {
  //     const insertCallInfoTabForAllohaTimerId = setInterval(() => {
  //         const topBar = document.querySelector("#app > div:nth-child(1) > div.flex.v2-open.sidebar-v2-location.FQ2QW4FaaR2EA12eaHnC.flex.v2-open.sidebar-v2-location > div:nth-child(2) > header > div.flex.flex-row.justify-start.items-center.topmenu-nav")
  //         if (topBar) {
  //             console.log("topbarfound", topBar)
  //             const customBtn = `<button class="callInfoAllohaBtn group text-left mx-1 pb-2 md:pb-3 text-sm font-medium
  //             topmenu-navitem cursor-pointer relative px-2">Alloha Call Details</button>`;

  //             // Create a temporary div element
  //             const tempDiv = document.createElement('div');
  //             tempDiv.innerHTML = customBtn;

  //             // Append the first child of the temporary div (the button) to the topBar
  //             topBar.appendChild(tempDiv.firstChild);

  //             attachEventListenerToCallInfoAllohaBtn();
  //             clearInterval(insertCallInfoTabForAllohaTimerId);
  //         }
  //     }, 100)
  // }

  // call info alloha btn
  const insertCallInfoBtnForAlloha = () => {
    const insertCallInfoBtnForAllohaTimerId = setInterval(() => {
      // attachEventListenerToCallInfoAllohaBtn();
      const callReportingDashboard = document.querySelector(
        "#call-reporting-dashboard"
      );
      if (callReportingDashboard) {
        callReportingDashboard.innerHTML = `<iframe src="https://clientflowx-app.netlify.app/highlevel/alloha/call-info?locationId=${window.locationUserId}" style="width:80vw;height:78vh"></iframe>`;
        clearInterval(insertCallInfoBtnForAllohaTimerId);
      }
    }, 100);
  };

  // call info alloha page desired url pattern
  const callInfoAllohaPageDesiredUrlPattern =
    /^https:\/\/app\.clientflowx\.com\/v2\/location\/[A-Za-z0-9]+\/reporting\/call_stats$/;

  // Check if the current URL matches the desired URL pattern
  if (callInfoAllohaPageDesiredUrlPattern.test(window.location.href)) {
    // Your code to run when the URLs match
    console.log("URL matches the pattern for call info");
    // insertCallInfoTabForAlloha();
    insertCallInfoBtnForAlloha();
  }

  // phase 2 end ========================================================

  window.addEventListener("popstate", function (event) {
    console.log("Page URL changed:", window.location.href);
    // Your code to handle URL change
  });
}
