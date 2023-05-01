/* Import React modules */
import React, { useRef, useState, useEffect } from "react";

/* Import ContentStack modules */
import { useAppConfig } from "../../common/hooks/useAppConfig";
import { useCustomField } from "../../common/hooks/useCustomField";
import { useEntry } from "../../common/hooks/useEntry";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { Button, cbModal } from "@contentstack/venus-components";

/* Import our CSS */
import "./styles.scss";
import "@contentstack/venus-components/build/main.css";

/* Import our modules */
import localeTexts from "../../common/locales/en-us";
import { TypeSDKData, RECORD } from "../../common/types/types";
import SelectorPage from "./SelectorPage/SelectorPageWithTable";


// This is so we can keep a global reference to the current component
declare global {
  interface Window {
    iframeRef: any;
    postRobot: any;
  }
}

/**
 * This custom field displays the currently selected items and provides
 * a button which opens a modal dialog. The modal dialog presents a larger
 * list of items to select (or deselect) from.
 *
 * @returns
 */
const CustomFieldWithModalExtension = () => {

  // This will keep a reference to the parent component
  const ref = useRef(null);

  // State for configuration
  const [state, setState] = React.useState<TypeSDKData>({
    config: {},
    contentTypeConfig: {},
    location: {},
    appSdkInitialized: false,
  });

  // State for selected assets received from selector page
  // const [selectedItems, setSelectedItems] = React.useState<{ [key: string]: [] }>({});
  const [selectedItems, setSelectedItems] = React.useState<[] | [RECORD]>([]);
;

  React.useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk: any) => {
        const config = await appSdk?.getConfig();
        const customFieldLocation = appSdk?.location?.CustomField;

        // This will track the reference to this component
        window.iframeRef = ref.current;
        window.postRobot = appSdk.postRobot;

        // Adjust height of iframe here
        appSdk.location.CustomField.frame.updateHeight(155);
        appSdk.location?.CustomField?.frame?.enableAutoResizing();

        // Retrive the config
        const contenttypeConfig = appSdk?.location?.CustomField?.fieldConfig;

        // Pull out initial saved data and assign to internal state
        const initialData = await customFieldLocation?.field?.getData();
        console.log("CustomFieldWithModal> initialData: ", initialData);
        if (initialData) {
          // Indirectly set App's Custom Field Data
          setSelectedItems(initialData);
        }

        // Keep some details in state
        setState({
          config,
          contentTypeConfig: contenttypeConfig,
          location: appSdk?.location,
          appSdkInitialized: true,
        });
      })
      .catch((error) => {
        console.error("appSdk initialization error", error);
      });
  }, []);


  /**
   * Save data of "selectedItems" state in custom field when updated
   * 
   */
  React.useEffect(() => {
    console.log("CustomFieldWithModal.useEffect> selectedItems: ", selectedItems);
    state?.location?.CustomField?.field?.setData(selectedItems);
  }, [
    selectedItems, 
  ]);

  /**
   * Handle items received from selectorpage component
   * 
   */
  const handleItemsFromModal = (items: [RECORD]) => {
    console.log("CustomFieldWithModal.handleItemsFromModal> items: ", items);
    setSelectedItems(items);
  };



  // function called onClick of "add asset" button. Handles opening of modal and selector window
  const openSelectorPage = async () => {
    if (state?.appSdkInitialized) {
      cbModal({
        component: (props: any) => <SelectorPage
                                      {...props}
                                      handleItems={handleItemsFromModal}
                                      currentItems={selectedItems}
                                      componentType="modal"
                                      />,
        modalProps: {
          onClose: () => {
            console.log("onClose get called");
          },
          onOpen: () => {
            console.log("onOpen gets called");
          },
          size: "customSize", //size: "customSize",
          shouldCloseOnEscape: true,
        },
        testId: "cs-modal-storybook",
      });
    }
  };

  return (
    <div className="field-extension-wrapper" ref={ref}>
      <div className="field-extension">
        {/* <div>[DEBUG] RECORDS: 
          { JSON.stringify(selectedItems)}
          </div> */}
        {state.appSdkInitialized && (
          <div className="field-wrapper" data-testid="field-wrapper">
            <>
              <ul style={{ listStyleType: "circle", paddingLeft: "2em"}}>
                {selectedItems?.length ? (
                  selectedItems.map((el: RECORD, i) => (
                    <li key={i}> <div >{el.item}</div></li>
                  ))
                ) : (
                  <div className="no-asset" data-testid="noAsset-div">
                    {localeTexts.CustomField.ItemsNotAddedText}
                  </div>
                )}
              </ul>
              <Button
                buttonType="control"
                className="add-asset-btn"
                onClick={openSelectorPage}
                data-testid="add-btn"
              >
                {localeTexts.CustomField.button.btnText}
              </Button>
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomFieldWithModalExtension;
