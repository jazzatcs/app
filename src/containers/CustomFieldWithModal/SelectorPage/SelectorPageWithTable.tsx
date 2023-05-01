import React, { useEffect, useState, useRef, useCallback } from "react";
import { RECORD } from "../../../common/types/types";

import {
  FieldLabel,
  TextInput,
  Checkbox,
  InfiniteScrollTable,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
} from "@contentstack/venus-components";
import { lowerCase } from "lodash";

// Use sample data for this example
const MAX_ITEMS = 25;
let ITEM_LIST: RECORD[] = new Array();

// Generate a list of CITIES*5 records
function generateLargelist() {
  let index = 0;
  const CITIES = ["Warsaw", "Copenhagen", "Stockholm", "Paris", "Oslo"];
  CITIES.map((x: string) => {
    [...Array(MAX_ITEMS/CITIES.length).keys()].map((i: number) => {
      ITEM_LIST.push({
        id: index++,
        checked: false,
        item: `CK-${x}-${i}`,
        key: `ck-${lowerCase(x)}-${i}`,
        description: `This item is called CK-${x}-${i}`,
      });
    });
  });
}
(async () => {
  await generateLargelist();
  console.log('SelectorPageWithModal> sample store list: ', ITEM_LIST);
})();






/**
 * This is the modal dialog window which presents a list of items for the user
 * to select from.
 * Selected items will be sent back to the caller via a provided callback
 *
 * @param param0
 * @returns
 */
const SelectorPage: React.FC<any> = function ({
  closeModal,
  handleItems,
  currentItems,
  componentType,
}) {

  /** 
   * Define ahead of initializing state to set the currently selected rows
   */
  const filterInitialRowIds = () => {  
    const initialRowIds = currentItems.map( (el:RECORD) => el.id)
    let selectedObj: any = {};
    initialRowIds.forEach((assetUid:number) => {
       selectedObj[assetUid] = true;
    });
    console.log('SelectorPageWithModal> ctor: ', selectedObj)
    return {...selectedObj}
  }

  // Holds the superset of items
  const [data, updateData] = useState(ITEM_LIST);
  const [viewBy, updateViewBy] = useState("Comfort");

  // Holds the current load status of each row
  const [itemStatusMap, updateItemStatusMap] = useState({});

  // Track total count of records
  const [totalCounts, updateTotalCounts] = useState(0);

  const [loading, updateLoading] = useState(false);

  // Tracks all the row ids that are selected
  let [selectedAssets, updateSelectedAssets] = useState(filterInitialRowIds())

  const [resetRowSelection, updateResetRowSelection] = useState(false);

  // Final list of objects that have been selected (technically this could be 
  // derived given the <code>selectedAssets</code> list)
  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);


  // Column header definitions
  const columns = [
    {
      Header: "Store Id",
      id: "id",
      accessor: "id",
      default: false,
      addToColumnSelector: true,
      columnWidthMultiplier: 1,
    },
    {
      Header: "Checked",
      id: "checked",
      accessor: "checked",
      default: false,
      addToColumnSelector: true,
      columnWidthMultiplier: 1,
    },
    {
      Header: "Store",
      id: "item",
      accessor: "item",
      default: false,
      addToColumnSelector: true,
      columnWidthMultiplier: 1,
    },
    {
      Header: "Key",
      id: "key",
      accessor: (data: RECORD) => {
        if (viewBy === "Comfort") {
          return (
            <div>
              <div>{data.key}</div>
            </div>
          );
        }
        return data.key;
      },
      default: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 1,
    },
    {
      Header: "Description",
      id: "description",
      accessor: "description",
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 2
    },
  ];

  /**
   * For initial component load
   */
  useEffect(() => {
    updateData(ITEM_LIST);
    setSelectedItems({...currentItems});
    updateTotalCounts(ITEM_LIST.length);

    // Update the loading status for all rows
    const all_loaded = [...Array(MAX_ITEMS).keys()].map(() => "loaded");
    updateItemStatusMap({ ...all_loaded });
    updateLoading(false);

    console.log('SelectorPageWithModal.useEffect[]> data: ', data);
    console.log('SelectorPageWithModal.useEffect[]> itemStatusMap: ', itemStatusMap);
    
  }, []);

  /**
   *
   * @param singleSelectedRowIds
   * @param selectedData
   */
  const getSelectedRow = (singleSelectedRowIds: [], selectedData: {}) => {
    console.log('SelectorPageWithModal/getSelectedRow -> singleSelectedRowIds, selectedData', singleSelectedRowIds, selectedData)

    // Update the selected asset row id list
    let selectedObj: any = {};
    singleSelectedRowIds.forEach((assetUid) => {
      selectedObj[assetUid] = true;
    });
    console.log('SelectorPageWithModal/getSelectedRow> selectedObj: ', selectedObj)
    updateSelectedAssets({ ...selectedObj })
    
    // This is where we also maintain the `selectedItems` array so it's 
    // available when we send the data back to the parent component
    let temp: RECORD[] = new Array();
    new Promise((resolve) => {
      singleSelectedRowIds.forEach((id) => {
        temp.push(ITEM_LIST[id]);
      });
      console.log("SelectorPageWithModal.getSelectedRow> updated selectedItems:", temp);
      setSelectedItems(temp);
    });
  };

  /**
   *
   */
  const onRowSelectProp = [
    {
      label: "Log selected Items",
      cb: (data: {}) => {
        console.log("selected data", data);
        updateResetRowSelection(true);
      },
    },
  ];


  /**
   * Submit all the selections to the custom field
   */
  const onSendData = () => {
    //callback
    console.log('SelectorPageWithModal.onSendData> selectedItems: ', selectedItems)
    handleItems([...selectedItems]);
    closeModal();
  };

  /**
   * Finally render component view
   */
  return (
    <div style={{ width: "75vmax" }}>
      <ModalHeader title="Header" closeModal={closeModal} />

      <ModalBody className="modalBodyCustomClass">

        <div style={{ paddingLeft: 5 }}>
          <InfiniteScrollTable
            data={data}
            disabled={false}
            equalWidthColumns={true}
            columns={columns}
            uniqueKey={"id"}
            totalCounts={totalCounts}
            fetchTableData={() => {}}
            loadMoreItems={ () => {}}
            itemStatusMap={itemStatusMap}
            viewSelector={true}
            getViewByValue={(selectedViewBy: any) => {
              updateViewBy(selectedViewBy);
            }}
            initialSortBy={[{ id: "id", asc: true }]}
            columnSelector={true}
            searchPlaceholder={"Search for items"}
            canSearch={false}
            canRefresh={true}
            fullRowSelect={false}
            initialSelectedRowIds={selectedAssets} //{{ 2: true, 5: true, 7: true}}
            isRowSelect={true}
            onRowSelectProp={onRowSelectProp}
            getSelectedRow={getSelectedRow}
          />
        </div>
        {/* 
          // This is a previous version which renders all the available items in a simple list 
          // with a checkbox.
          // However, I switched to the table view to display additional details in a nicer format
        
         {ITEM_LIST.map((el, i) => (
          <div key={i} className="Checkbox-wrapper">
            <Checkbox
              onClick={() => {
                console.log("selecting item: ", el.item);
                const exists = selectedItems.some((x) => x.item === el.item);
                console.log("exists: ", exists);

                if (exists) {
                  const newArray = selectedItems.filter(
                    (x) => x.item !== el.item
                  );
                  console.log("newArray after removal: ", newArray);
                  setSelectedItems(newArray);
                } else {
                  const newArray = [...selectedItems, el];
                  console.log("newArray after adding: ", newArray);
                  setSelectedItems(newArray);
                }

                // console.log('new state: ', selectedItems)
              }}
              label={el.item}
              checked={selectedItems.some((x) => x.item === el.item)}
              enabled="true"
            />
          </div>
        ))} */}
      </ModalBody>

      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="light" onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button onClick={() => onSendData()}>Select</Button>
        </ButtonGroup>
      </ModalFooter>
    </div>
  );
};

export default SelectorPage;
