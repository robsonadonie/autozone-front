import { RootState } from '@/redux/store/store';
import React from 'react'
import CountUp from 'react-countup'
import { useSelector } from 'react-redux';
import { ToWords } from 'to-words';
import { startOfMonth, endOfMonth, format, isWithinInterval, subMonths, isAfter, isBefore, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { formatCurrency } from './SuiviVentes/utils';
import "../font.style.css"
import { APP_URL } from "../../process.env";

export default function PrintJournals({ data, dates, rec, dep }) {
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
      minimumFractionDigits: 0
    }).format(value);
  }

  function factureParDate() {
    let data = []
    dates.map((e, i) => {
      const r = rec.find((item) => item.daty == e)
      const d = dep.find((item) => item.daty == e).dataDepense
      data.push({ daty: e, revenue: r.dataSimple.concat(r.dataRecette), depense: d })

    })
    return data
  }
  function destructrevenu(data = []) {
    let bigArray = []
    data.map((e) => {
      bigArray = [...bigArray, ...e.revenue]
    });
    return bigArray
  }


  function destructDepens(data = []) {
    let bigArray = []
    data.map((e) => {
      bigArray = [...bigArray, ...e.depense]
    });
    return bigArray

  }


  const About = useSelector((state: RootState) => state.AboutSlice) as any





  return (
    <div className="view-invoices   z-50   h-[100vh]   w-full flex justify-center times">
      <div className="cadre relative w-full h-full bg-white pt-4">
        <div className="head">
          <div className="logo flex items-center justify-center gap-2">
            <img src="/logo3.png" width={"90px"} alt="" />
            <img src={APP_URL+"/images/name2.png"} alt="" width={"250px"} />
            {/* <img src="/name2.png" alt="" width={"250px"}  /> */}
            {/* <h2 className="text-6xl text-red-500 font-bold" style={{ fontFamily: "revert", fontStyle: "italic" }}>{(About.data).nom}</h2> */}
          </div>
          <h3 className="text-center mt-2 text-orange-700 italic " style={{ fontSize: "13px" }}>{(About.data).slogan}</h3>
          <p className="text-center italic text-xs mt-1">STATS : {(About.data).stat} / NIF : {(About.data).nif} / {(About.data).rcs}</p>
          <p className="text-center italic text-xs font-semibold mt-1">{(About.data).adresse}</p>
          <p className="text-center text-xs font-semibold mt-1" style={{ fontSize: "12px" }}>Tel: {(About.data).telephone} / E-mail: {(About.data).email}</p>
        </div>
        <div>
          {/* <h2 className='text-center text-2xl mt-6'>Recettes et Dépenses : <span className='text-xl'>{format(new Date(), 'dd/MM/yyyy')}</span></h2> */}
          <div className='w-[60%] m-auto   pt-10'>
            {
              data.map((e, i) => (
                <div key={i}>

                  <div className='flex items-center gap-3  text-black font-bold text-sm'><hr className='flex-grow' /> {format(new Date(e.daty), 'dd/MM/yyyy')}  <hr className='flex-grow' /></div>
                  <div className=''>
                    <p className='mt-2  text-black font-bold'>Recettes</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {/* <TableHead className="w-12">Date</TableHead> */}
                          <TableHead className="p-0 h-0 text-black font-bold text-left pl-0">Intitulé</TableHead>
                          <TableHead className="p-0 h-0 text-black font-bold">Mode de paiement</TableHead>
                          <TableHead className=' text-end pr-0 text-black font-bold'>Montant</TableHead>

                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {e.revenue.map((revenue, index) => (
                          <TableRow key={index}>

                            <TableCell className=" text-black font-bold py-0  text-left pl-0" style={{ fontSize: "13px" }}>
                              <div>
                                <p className="  capitalize  text-black font-bold  text-left pl-0" style={{ fontSize: "13px" }}>{revenue.cause}</p>
                              </div>
                            </TableCell>
                            <TableCell className=" text-black font-bold py-0" style={{ fontSize: "13px" }}>
                              <div>
                                <p className="capitalize  text-black font-bold" style={{ fontSize: "13px" }}>{revenue.mode_paiement}</p>
                              </div>
                            </TableCell>
                            <TableCell className=" py-0 text-end pr-0  text-black font-bold">
                              {formatNumber(revenue.montant) || 0} Ar
                            </TableCell>

                          </TableRow>
                        ))}

                      </TableBody>
                    </Table>
                    <div className='border-t pt-2'>
                      <h4 className='text-end font-bold text-xs'>
                        Somme :  {e.revenue.map(e => e.montant).length != 0 ? formatNumber(e.revenue.map(e => e.montant).reduce((a, b) => a + b)) : 0}
                        &nbsp; Ar</h4>
                    </div>
                    <p className='mt-2 text-red-400 mb-2 font-bold'>Dépenses</p>
                    <Table>
                      <TableHeader >
                        <TableRow className="p-0">
                          {/* <TableHead className="w-12">Date</TableHead> */}
                          <TableHead className="py-1 h-0  text-black font-bold text-left pl-0" >Désignation</TableHead>
                          <TableHead className="py-1 h-0  text-black font-bold  text-right pr-0" >Montant</TableHead>

                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {e.depense.map((expense, index) => (
                          <TableRow key={expense.id}>

                            <TableCell className=" text-black font-bold py-0  text-left pl-0">
                              <div>
                                <p className=" text-black font-bold  text-left pl-0" style={{ fontSize: "13px" }}>{expense.cause}</p>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold   text-right pr-0 text-red-600 py-0">
                              {formatNumber(expense.montant) || 0} Ar
                            </TableCell>

                          </TableRow>
                        ))}

                      </TableBody>
                    </Table>
                    <div className='border-t pt-2'>
                      <h4 className='text-end  text-black font-bold text-xs'>
                        Somme :  {e.depense.map(e => e.montant).length != 0 ? formatNumber(e.depense.map(e => e.montant).reduce((a, b) => a + b)) : 0}
                        &nbsp;  Ar</h4>
                    </div>
                    <div className='flex flex-col items-end mt-2'>
                      <hr className='w-36 mb-2' />

                      <p className='text-xs text-end mb-4  text-black font-bold'> Espèces : {formatNumber((e.revenue.filter((item) => item.mode_paiement == "espèce").length != 0 ? (e.revenue.filter((item) => item.mode_paiement == "espèce").map((item) => item.montant)).reduce((a, b) => a + b) : 0) - (e.depense.map(e => e.montant).length != 0 ? (e.depense.map(e => e.montant).reduce((a, b) => a + b)) : 0)) || 0} Ar |  Mobile : {formatNumber((e.revenue.filter((item) => item.mode_paiement != "espèce").length != 0 ? (e.revenue.filter((item) => item.mode_paiement != "espèce").map((item) => item.montant)).reduce((a, b) => a + b) : 0)) || 0} Ar </p>
                    </div>
                  </div>
                </div>

              ))
            }
            {/* </div> */}
            <h2 className='text-md text-center   text-black font-bold mt-12'>Reste : <span>{formatNumber((destructrevenu(data).map(e => e.montant).length != 0 ? destructrevenu(data).map(e => e.montant).reduce((a, b) => a + b) : 0) - (destructDepens(data).map(e => e.montant).length != 0 ? destructDepens(data).map(e => e.montant).reduce((a, b) => a + b) : 0)) || 0} Ar</span></h2>
            <p className="text-center mt-2 text-xs  text-black font-bold">Arrête la présence à la somme de :</p>
            <p className="text-center mt-1  text-black font-bold" style={{ fontSize: "13px" }}>{toWords.convert((destructrevenu(data).map(e => e.montant).length != 0 ? destructrevenu(data).map(e => e.montant).reduce((a, b) => a + b) : 0) - (destructDepens(data).map(e => e.montant).length != 0 ? destructDepens(data).map(e => e.montant).reduce((a, b) => a + b) : 0))} </p>
          </div>
        </div>

      </div>
    </div >
  )
}
