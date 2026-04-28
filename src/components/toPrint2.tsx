import { RootState } from '@/redux/store/store';
import React from 'react'
import CountUp from 'react-countup'
import { useSelector } from 'react-redux';
import { ToWords } from 'to-words';
import "../font.style.css"
import { format } from 'date-fns';
import { APP_URL } from "../../process.env";
export default function ToPrints({ selectedInvoice, num }) {
  const toWords = new ToWords({
    localeCode: 'fr-FR',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        // can be used to override defaults for the selected locale
        name: 'Ariary',
        plural: 'Ariary',
        symbol: 'Ar',
        fractionalUnit: {
          name: 'Paisa',
          plural: 'Paise',
          symbol: '',
        },
      },
    },
  });
  function formatNumber(value) {
    if (!value) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 2
    }).format(value);
  }

  const About = useSelector((state: RootState) => state.AboutSlice) as any

  return (
    <div className="view-invoices fixed times  left-0 top-0 z-50   w-full h-[870px] flex justify-center">

      <div className="cadre relative w-[560px] h-full bg-white pt-4">
        <div className="head">
          <div className="logo flex items-center justify-center gap-2">
            <img src={APP_URL+"/images/logo3.png"} width={"100px"} alt="" />
            <img src="/name2.png" alt="" width={"250px"}  />
            {/* <h2 className="text-6xl text-red-500 font-bold" style={{ fontFamily: "revert", fontStyle: "italic" }}>{(About.data).nom}</h2> */}
          </div>
          <h3 className="text-center mt-2 text-orange-700 italic " style={{ fontSize: "13px" }}>{(About.data).slogan}</h3>
          {
            (((selectedInvoice.client.stat)?.trim() != "") && ((((selectedInvoice.client.nif)?.trim() != "")))) &&
            <p className="text-center italic text-xs mt-1">STATS : {(About.data).stat} / NIF : {(About.data).nif} / {(About.data).rcs}</p>
          }
          <p className="text-center italic text-xs font-semibold mt-1">{(About.data).adresse}</p>
          <p className="text-center text-xs font-semibold mt-1"  style={{ fontSize: "12px" }}>Tel: {(About.data).telephone} / E-mail: {(About.data).email}</p>
        </div>
        <div className="client flex items-start justify-between px-6 pt-2">
          <div className="idt flex flex-col">
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>Client   <span>:</span></h3>
              <input type="text" defaultValue={`${selectedInvoice.client.firstName} ${selectedInvoice.client.name}`} className="outline-none text-sm" />
            </div>
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>Adresse   <span>:</span></h3>
              <input type="text" defaultValue={selectedInvoice.client.adresse} className="outline-none text-sm w-64" />
            </div>
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>Téléphone   <span>:</span></h3>
              <input type="text" defaultValue={selectedInvoice.client.telephone} className="outline-none text-sm" />
            </div>
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>NIF   <span>:</span></h3>
              <input type="text" defaultValue={selectedInvoice.client.nif} className="outline-none text-sm" />
            </div>
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>STAT   <span>:</span></h3>
              <input type="text" defaultValue={selectedInvoice.client.stat} className="outline-none text-sm" />
            </div>
          </div>
          <div className="fact">
            <h3 className=" text-center  font-bold text-sm" style={{ fontSize: "13px" }}>Date:  {(format(new Date(), "dd/MM/yyyy"))}</h3>
            <div className="numero-facture border-2 border-black p-1 w-[190px] mt-1">
              <h4 className="text-center font-semibold" style={{ fontSize: "13px" }}>Facture</h4>
              <input type="text" className="outline-none mt-1 text-sm text-center font-bold w-full" defaultValue={num} style={{ fontSize: "12px" }} />
            </div>
          </div>
        </div>
        <div className="array px-6 mt-2">
          <table className="w-full text-xs border-b-2 border-black ">
            <thead>
              <tr>
                <td className="border-2 p-0 border-black text-center   font-bold" style={{ fontSize: "10px", height: "3px", padding: "0 4px" }}>DESIGNATION</td>
                <td className="border-2 p-0 border-black text-center font-bold" style={{ fontSize: "10px", height: "3px", padding: "0 4px" }}>QTE</td>
                <td className="border-2 p-0  w-20 border-black text-center font-bold" style={{ fontSize: "10px", height: "3px", padding: "0 4px" }}>P/U AR HT</td>
                <td className="border-2 p-0 border-black text-center text-nowrap w-20 font-bold" style={{ fontSize: "10px", height: "3px", padding: "0 4px" }}>Montant Total AR</td>

              </tr>
            </thead>
            <tbody>
              {/* {
                    selectedInvoice?.selectedInvoices.map((selectedInvoice, i) => ( */}

              <tr>
                <td className="border h-3 border-l-2  uppercase border-black text-xs font-bold" style={{fontSize:"11px"}} >{selectedInvoice.stock.designation}</td>
                <td className="border h-3 border-black text-center w-4 font-bold" style={{fontSize:"11px"}} >{formatNumber(selectedInvoice.quantite)}</td>
                <td className="border h-3 text-end pr-1 border-black w-20 font-bold text-nowrap" style={{fontSize:"11px"}} >
                  {formatNumber(selectedInvoice.total_HT / selectedInvoice.quantite) || 0}   Ar</td>
                <td className="border border-r-2 h-3  text-end pr-1 border-black w-20 text-nowrap font-bold" style={{fontSize:"11px"}} >
                  {formatNumber(selectedInvoice.total_HT) || 0} Ar
                </td>
              </tr>
              {/* ))
                  } */}
              {
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10, 11, 12].map((e, i) => (

                  <tr key={i}>
                    <td className="border h-3 border-l-2 border-black text-xs"> </td>
                    <td className="border h-3 border-black w-4"></td>
                    <td className="border h-3 border-black w-20 text-nowrap"></td>
                    <td className="border border-r-2 h-3 border-black w-20 text-nowrap"></td>
                  </tr>
                ))
              }

            </tbody>
          </table>
          <div className="total flex flex-col items-end mt-0">
            <div className="flex">
              <h3 style={{ fontSize: "12px" , fontWeight:"bold" }}>Montant Total Ar =&gt;</h3>
              <div className="" style={{ width: "130px", borderBottom: "1px double black", paddingBottom: "2px" }}>
                <div className=" " style={{ borderBottom: "1px double black" }}>
                  <h4 className="text-black text-end font-semibold" style={{ fontSize: "12px" }}>
                    {formatNumber(selectedInvoice?.total_HT)}  Ar</h4>
                </div>
              </div>
            </div>
            {
              selectedInvoice?.TVA != 0 &&
              <div className="flex">
                <h3 style={{ fontSize: "12px" , fontWeight:"bold" }}>Montant TVA 20% =&gt;</h3>
                <div className="" style={{ width: "130px", borderBottom: "1px double black", paddingBottom: "2px" }}>
                  <div className=" " style={{ borderBottom: "1px double black" }}>
                    <h4 className="text-black text-end font-semibold" style={{ fontSize: "12px" }}>
                      {formatNumber(selectedInvoice?.TVA)}    Ar</h4>
                  </div>
                </div>
              </div>
            }
            {
              selectedInvoice?.TVA != 0 &&
              <div className="flex">
                <h3 style={{ fontSize: "12px" , fontWeight:"bold" }}>Montant  Ar TTC =&gt;</h3>
                <div className="" style={{ width: "130px", borderBottom: "1px double black", paddingBottom: "2px" }}>
                  <div className=" " style={{ borderBottom: "1px double black" }}>
                    <h4 className="text-black text-end font-semibold" style={{ fontSize: "12px" }}>
                      {formatNumber(selectedInvoice?.TVA + selectedInvoice?.total_HT)}   Ar</h4>
                  </div>
                </div>
              </div>
            }

          </div>
        </div>
        <div className="mt-2">

          <p className="text-center text-xs font-bold">Arrête la présence à la somme de :</p>
          <p className="text-center uppercase font-semibold" style={{ fontSize: "12px" }}>{toWords.convert(isNaN(selectedInvoice?.TVA + selectedInvoice?.total_HT) ? 0 : (selectedInvoice?.TVA + selectedInvoice?.total_HT))} </p>
        </div>
        <div className="foot px-6 mt-4">
        <div className="flex justify-between w-full">
          <div className="mode w-[340px]">
            <h4 style={{ fontSize: "13px" }} className='font-semibold ml-10'>Mode de paiement: <span className="ml-4 capitalize"> {selectedInvoice?.mode_paiement}  </span></h4>
            <h2 className="  mt-1 capitalize ml-20 font-bold" style={{ fontSize: "13px" }}>Client </h2>
            <div className=" border  border-black p-2 w-[170px] mt-2">
              <input type="text" style={{ fontSize: "13px" }} className="outline-none text-center w-full" />

            </div>
          </div>
          <div className="text-center w-[180px]">
            <h3 style={{ fontSize: "13px" ,fontWeight:"bold"}}>AutoZone</h3>
          </div>

          </div>
        
        </div>
      </div>

      <div className="  border h-full border-black border-dashed"></div>

      <div className="cadre relative w-[560px] h-full bg-white pt-4">
        <div className="head">
          <div className="logo flex items-center justify-center gap-2">
            <img src={APP_URL+"/images/logo3.png"} width={"100px"} alt="" />
            <img src="/name2.png" alt="" width={"250px"}  />
            {/* <h2 className="text-6xl text-red-500 font-bold" style={{ fontFamily: "revert", fontStyle: "italic" }}>{(About.data).nom}</h2> */}
          </div>
          <h3 className="text-center mt-2 text-orange-700 italic " style={{ fontSize: "13px" }}>{(About.data).slogan}</h3>
          {
            (((selectedInvoice.client.stat)?.trim() != "") && ((((selectedInvoice.client.nif)?.trim() != "")))) &&
            <p className="text-center italic text-xs mt-1">STATS : {(About.data).stat} / NIF : {(About.data).nif} / {(About.data).rcs}</p>
          }
          <p className="text-center italic text-xs font-semibold mt-1">{(About.data).adresse}</p>
          <p className="text-center text-xs font-semibold mt-1"  style={{ fontSize: "12px" }}>Tel: {(About.data).telephone} / E-mail: {(About.data).email}</p>
        </div>
        <div className="client flex items-start justify-between px-6 pt-2">
          <div className="idt flex flex-col">
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>Client   <span>:</span></h3>
              <input type="text" defaultValue={`${selectedInvoice.client.firstName} ${selectedInvoice.client.name}`} className="outline-none text-sm" />
            </div>
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>Adresse   <span>:</span></h3>
              <input type="text" defaultValue={selectedInvoice.client.adresse} className="outline-none text-sm w-64" />
            </div>
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>Téléphone   <span>:</span></h3>
              <input type="text" defaultValue={selectedInvoice.client.telephone} className="outline-none text-sm" />
            </div>
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>NIF   <span>:</span></h3>
              <input type="text" defaultValue={selectedInvoice.client.nif} className="outline-none text-sm" />
            </div>
            <div className="list flex selectedInvoices-center gap-4">
              <h3 className="text-sm font-bold text-black  w-12 flex justify-between" style={{ fontSize: "9px" }}>STAT   <span>:</span></h3>
              <input type="text" defaultValue={selectedInvoice.client.stat} className="outline-none text-sm" />
            </div>
          </div>
          <div className="fact">
            <h3 className=" text-center  font-bold text-sm" style={{ fontSize: "13px" }}>Date:  {(format(new Date(), "dd/MM/yyyy"))}</h3>
            <div className="numero-facture border-2 border-black p-1 w-[190px] mt-1">
              <h4 className="text-center font-semibold" style={{ fontSize: "13px" }}>Facture</h4>
              <input type="text" className="outline-none mt-1 text-sm text-center font-bold w-full" defaultValue={num} style={{ fontSize: "12px" }} />
            </div>
          </div>
        </div>
        <div className="array px-6 mt-2">
          <table className="w-full text-xs border-b-2 border-black ">
            <thead>
              <tr>
                <td className="border-2 p-0 border-black text-center   font-bold" style={{ fontSize: "10px", height: "3px", padding: "0 4px" }}>DESIGNATION</td>
                <td className="border-2 p-0 border-black text-center font-bold" style={{ fontSize: "10px", height: "3px", padding: "0 4px" }}>QTE</td>
                <td className="border-2 p-0  w-20 border-black text-center font-bold" style={{ fontSize: "10px", height: "3px", padding: "0 4px" }}>P/U AR HT</td>
                <td className="border-2 p-0 border-black text-center text-nowrap w-20 font-bold" style={{ fontSize: "10px", height: "3px", padding: "0 4px" }}>Montant Total AR</td>

              </tr>
            </thead>
            <tbody>
              {/* {
                    selectedInvoice?.selectedInvoices.map((selectedInvoice, i) => ( */}

              <tr>
                <td className="border h-3 border-l-2  uppercase border-black text-xs font-bold" style={{fontSize:"11px"}} >{selectedInvoice.stock.designation}</td>
                <td className="border h-3 border-black text-center w-4 font-bold" style={{fontSize:"11px"}} >{formatNumber(selectedInvoice.quantite)}</td>
                <td className="border h-3 text-end pr-1 border-black w-20 font-bold text-nowrap" style={{fontSize:"11px"}} >
                  {formatNumber(selectedInvoice.total_HT / selectedInvoice.quantite) || 0}   Ar</td>
                <td className="border border-r-2 h-3  text-end pr-1 border-black w-20 text-nowrap font-bold" style={{fontSize:"11px"}} >
                  {formatNumber(selectedInvoice.total_HT) || 0} Ar
                </td>
              </tr>
              {/* ))
                  } */}
              {
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10, 11, 12].map((e, i) => (

                  <tr key={i}>
                    <td className="border h-3 border-l-2 border-black text-xs"> </td>
                    <td className="border h-3 border-black w-4"></td>
                    <td className="border h-3 border-black w-20 text-nowrap"></td>
                    <td className="border border-r-2 h-3 border-black w-20 text-nowrap"></td>
                  </tr>
                ))
              }

            </tbody>
          </table>
          <div className="total flex flex-col items-end mt-0">
            <div className="flex">
              <h3 style={{ fontSize: "12px" , fontWeight:"bold" }}>Montant Total Ar =&gt;</h3>
              <div className="" style={{ width: "130px", borderBottom: "1px double black", paddingBottom: "2px" }}>
                <div className=" " style={{ borderBottom: "1px double black" }}>
                  <h4 className="text-black text-end font-semibold" style={{ fontSize: "12px" }}>
                    {formatNumber(selectedInvoice?.total_HT)}  Ar</h4>
                </div>
              </div>
            </div>
            {
              selectedInvoice?.TVA != 0 &&
              <div className="flex">
                <h3 style={{ fontSize: "12px" , fontWeight:"bold" }}>Montant TVA 20% =&gt;</h3>
                <div className="" style={{ width: "130px", borderBottom: "1px double black", paddingBottom: "2px" }}>
                  <div className=" " style={{ borderBottom: "1px double black" }}>
                    <h4 className="text-black text-end font-semibold" style={{ fontSize: "12px" }}>
                      {formatNumber(selectedInvoice?.TVA)}    Ar</h4>
                  </div>
                </div>
              </div>
            }
            {
              selectedInvoice?.TVA != 0 &&
              <div className="flex">
                <h3 style={{ fontSize: "12px" , fontWeight:"bold" }}>Montant  Ar TTC =&gt;</h3>
                <div className="" style={{ width: "130px", borderBottom: "1px double black", paddingBottom: "2px" }}>
                  <div className=" " style={{ borderBottom: "1px double black" }}>
                    <h4 className="text-black text-end font-semibold" style={{ fontSize: "12px" }}>
                      {formatNumber(selectedInvoice?.TVA + selectedInvoice?.total_HT)}   Ar</h4>
                  </div>
                </div>
              </div>
            }

          </div>
        </div>
        <div className="mt-2">

          <p className="text-center text-xs font-bold">Arrête la présence à la somme de :</p>
          <p className="text-center uppercase font-semibold" style={{ fontSize: "12px" }}>{toWords.convert(isNaN(selectedInvoice?.TVA + selectedInvoice?.total_HT) ? 0 : (selectedInvoice?.TVA + selectedInvoice?.total_HT))} </p>
        </div>
        <div className="foot px-6 mt-4">
        <div className="flex justify-between w-full">
          <div className="mode w-[340px]">
            <h4 style={{ fontSize: "13px" }} className='font-semibold ml-10'>Mode de paiement: <span className="ml-4 capitalize"> {selectedInvoice?.mode_paiement}  </span></h4>
            <h2 className="  mt-1 capitalize ml-20 font-bold" style={{ fontSize: "13px" }}>Client </h2>
            <div className=" border  border-black p-2 w-[170px] mt-2">
              <input type="text" style={{ fontSize: "13px" }} className="outline-none text-center w-full" />

            </div>
          </div>
          <div className="text-center w-[180px]">
            <h3 style={{ fontSize: "13px" ,fontWeight:"bold"}}>AutoZone</h3>
          </div>

          </div>
          <div className='border-4 mt-2 text-2xl p-2 px-4 font-bold font-serif text-center border-black w-fit'>
            <h2>COPIE MAGASIN</h2>
          </div>
        </div>
      </div>


    </div>
  )
}
