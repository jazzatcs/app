const localeTexts = {
  404: {
    title: "404: Not Found",
    body: "The link you tried to access doesn't seem to exist. <br /> Please verify and enter the correct URL.",
    button: {
      learnMore: "Learn more",
    },
  },
  AssetSidebarWidget: {
    title: "Asset Sidebar Widget",
    body: "This is the iframe that contains your asset sidebar widget <br /> Build your app now",
    button: {
      learnMore: "Learn more",
    },
  },
  ConfigScreen: {
    title: "App Configuration",
    body: "This is the iframe that contains your app configuration <br /> Build your app now",
    button: {
      learnMore: "Learn more",
    },
  },
  CustomField: {
    title: "Custom Field",
    body: "This is the iframe that contains your custom field <br /> Build your app now",
    button: {
      btnText: "Choose Item(s)",
      learnMore: "Learn more",
    },
    assetCard: {
      hoverActions: {
        preview: "Preview",
        platformRedirect: `Open In {rootConfig?.damEnv?.DAM_APP_NAME}`,
        remove: "Delete",
        drag: "Drag",
      },
    },
    ItemsNotAddedText: "No items have been added",
  },
  Warnings: {
    incorrectConfig: `The credentials you entered for the {rootConfig?.damEnv?.DAM_APP_NAME} App" are invalid or missing. Please update the configuration details and try again.`,
  },
  DashboardWidget: {
    title: "Dashboard Widget",
    body: "This is the iframe that contains your dashboard widget <br /> Build your app now",
    button: {
      learnMore: "Learn more",
    },
  },
  SidebarWidget: {
    title: "Sidebar Widget",
    body: "This is the iframe that contains your entry sidebar widget <br /> Build your app now",
    button: {
      learnMore: "Learn more",
    },
  },
  SelectorPage: {
    title: `Select Items Extension`,
  },
  DeleteModal: {
    header: "Delete",
    body: "This will delete <b>&apos;$&apos;</b> permanently.",
    cancelButton: "Cancel",
    confirmButton: "Delete",
  },
};

export default localeTexts;
