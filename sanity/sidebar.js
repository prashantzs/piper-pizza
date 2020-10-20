import React from 'react';
import S from '@sanity/desk-tool/structure-builder';

//Build a custom sidebar
export default function SideBar() {
    return S.list().title(`Slick's Slices`).items([
        //Create new sub item
        S.listItem()
         .title('Home Page')
         .child(
            S.editor()
             .schemaType('storeSettings')
             //Make new document ID
             .documentId('downtown')
        ),
        ...S.documentTypeListItems().filter(item => item.getId() !== 'storeSettings')
    ]);
}