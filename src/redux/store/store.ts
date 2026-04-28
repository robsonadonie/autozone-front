import { configureStore } from "@reduxjs/toolkit";
import { LevelSlice } from "../slice/level.slice";
import { AddOrigineSlice, OrigineSlice, UpOrigineSlice } from "../slice/origine.slice";
import { AddMarkSlice, MarkSlice, UpMarkSlice } from "../slice/mark.slice.";
import { ModeleSlice } from "../slice/modele.slice";
import { AddSerieSlice, SerieSlice } from "../slice/serie.slice";
import { AddStockSlice, StockSlice, UpStockSlice } from "../slice/StockSlice";
import { AddVentesSlice, UpVentesSlice, VentesSlice } from "../slice/VentesSlice";
import { AddClientSlice, ClientSlice, UpdateClientSlice } from "../slice/ClientSlice";
import { CollapseSlice } from "../slice/collapsed";
import { MarkProductSlice } from "../slice/productMark.slice";
import { AddEntreStockSlice, EntreStockSlice } from "../slice/EntreStockSlice";
import { AddInvoicesSlice, DelInvoicesSlice, InvoicesSlice } from "../slice/InvoicesSlice";
import { AddjournauxSlice, DeljournauxSlice, journauxSlice, UpjournauxSlice } from "../slice/journauxSlice";
import { AddUserSlice, LoginSlice, OneUserSlice, UserSlice } from "../slice/UserSlice";
import { AboutSlice, UpdateAboutSlice } from "../slice/aboutSlice";
import { importExcelSlice } from "../slice/importExcelSlice";
import { UpdateExportSlice } from "../slice/ExportSlice";

export const storeRedux = configureStore({
     reducer: {
          LevelSlice: LevelSlice.reducer,
          OrigineSlice: OrigineSlice.reducer,
          MarkSlice: MarkSlice.reducer,
          LoginSlice: LoginSlice.reducer,
          AddOrigineSlice: AddOrigineSlice.reducer,
          ClientSlice: ClientSlice.reducer,
          UpVentesSlice: UpVentesSlice.reducer,
          UserSlice: UserSlice.reducer,
          AddMarkSlice: AddMarkSlice.reducer,
          AddClientSlice: AddClientSlice.reducer,
          AddVentesSlice: AddVentesSlice.reducer,
          UpdateClientSlice: UpdateClientSlice.reducer,
          AddStockSlice: AddStockSlice.reducer,
          MarkProductSlice: MarkProductSlice.reducer,
          UpdateExportSlice: UpdateExportSlice.reducer,
          CollapseSlice: CollapseSlice.reducer,
          AddSerieSlice: AddSerieSlice.reducer,
          UpdateAbout: UpdateAboutSlice.reducer,
          DeljournauxSlice: DeljournauxSlice.reducer,
          UpjournauxSlice: UpjournauxSlice.reducer,
          InvoicesSlice: InvoicesSlice.reducer,
          SerieSlice: SerieSlice.reducer,
          journauxSlice: journauxSlice.reducer,
          AddjournauxSlice: AddjournauxSlice.reducer,
          importExcelFile: importExcelSlice.reducer,
          AddInvoicesSlice: AddInvoicesSlice.reducer,
          UpStockSlice: UpStockSlice.reducer,
          AddEntreStockSlice: AddEntreStockSlice.reducer,
          EntreStockSlice: EntreStockSlice.reducer,
          OneUserSlice: OneUserSlice.reducer,
          UpOrigineSlice: UpOrigineSlice.reducer,
          UpMarkSlice: UpMarkSlice.reducer,
          VentesSlice: VentesSlice.reducer,
          AboutSlice: AboutSlice.reducer,
          StockSlice: StockSlice.reducer,
          DelInvoicesSlice: DelInvoicesSlice.reducer,
          AddUserSlice: AddUserSlice.reducer,
          ModeleSlice: ModeleSlice.reducer
     }
})
export type AppDispatch = typeof storeRedux.dispatch
export type RootState = ReturnType<typeof storeRedux.getState>