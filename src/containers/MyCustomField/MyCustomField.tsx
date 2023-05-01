import Icon from "../../assets/customfield.svg";
import localeTexts from "../../common/locales/en-us/index";
import parse from "html-react-parser";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import { useCustomField } from "../../common/hooks/useCustomField";
import { useEntry } from "../../common/hooks/useEntry";

const MyCustomFieldExtension = () => {


  const  appConfig = useAppConfig()
  const  { customField, setFieldData, loading } = useCustomField()
  const { entryData, loading: isLoading } = useEntry()

  console.log('CustomFieldExtension> config: ', appConfig)
  console.log('CustomFieldExtension> customField: ', customField)

  ContentstackAppSdk.init().then(async (appSdk) => {
    const config = await appSdk?.getConfig();
    
    // appSdk.stack.getEnvironment = () => { 
    //   return "abc"
    // }

    console.log('appSdk: ', appSdk)
    console.log('currentuser: ', appSdk.currentUser)
    console.log('field: ', appSdk?.location?.CustomField?.field)
    console.log('entry: ', appSdk.location.CustomField?.entry)
    console.log('fieldModifier: ', appSdk.location.CustomField?.fieldModifier)
    console.log('current locale: ', appSdk.location.CustomField?.entry.locale)
  

    const field = appSdk?.location?.CustomField?.field
    const fieldModifier = appSdk?.location?.FieldModifierLocation;
    console.log('fieldModifier: ', fieldModifier)


    const entry = appSdk?.location?.CustomField?.entry

    console.log('entry: ', entry)
    entry.getField('anotherfield').setData('cannot edit this value 3')
    entry.getField('anotherfield').schema.non_localizable = true
    entry.getField('anotherfield').schema.updateRestrict = true
    console.log('anotherfield: ', entry.getField('anotherfield'))
    console.log('entryData: ', entryData)
    // entryData.non_localizable = true

    appSdk?.location?.CustomField?.entry.onSave( function(arg: any) {
      console.log('onSave triggered with argument: ',arg)
      console.log('entry._data: ',appSdk.location.CustomField?.entry._data)
      console.log('entry._changedData: ',appSdk.location.CustomField?.entry._changedData)

      if( appSdk.location.CustomField != null) {

        appSdk.location.CustomField.entry._data["customKey"]="customValue";
        
    
      }
    })

    // appSdk?.location?.CustomField?.entry.onChange( function(arg: any) {
    //   console.log('onChange triggered with argument: ',arg)

    //   if( appSdk.location.CustomField != null) {
    //     console.log('updating onchange...before: ', appSdk?.location?.CustomField?.entry._data);

    //     appSdk.location.CustomField.entry._changedData["single_line_textbox_hidden"] = 
    //       JSON.stringify(appSdk?.location?.CustomField?.entry._data)
    //     appSdk.location.CustomField.entry._data["single_line_textbox_hidden"] = 
    //       JSON.stringify(appSdk?.location?.CustomField?.entry._data)


    //     console.log('updating onchange...after: ', appSdk?.location?.CustomField?.entry._data); 
    //   }

    // })

  })

  return (
    <div className="custom-field">
      <div className="custom-field-container">
        <div className="custom-field-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>{localeTexts.CustomField.title}</h4>
          <p>{parse(localeTexts.CustomField.body)}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.contentstack.com/docs/developers/developer-hub/custom-field-location/">
            {localeTexts.CustomField.button.learnMore}
          </a>
        </div>
      </div>
    </div>
  );
};

export default MyCustomFieldExtension;
