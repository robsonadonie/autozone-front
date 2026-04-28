import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { changeMsg } from "@/redux/slice/VentesSlice";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { StockAsync } from "@/redux/Async/stockAsync";
import { OneUserAsync } from "@/redux/Async/userAuthAsync";
import { jwtDecode } from "jwt-decode";

const ClickOutside = ({ change, index, remove, value }) => {


    const dispatch = useDispatch<AppDispatch>()

    function formatNumber(value) {
        if (!value) return '';
        return new Intl.NumberFormat('fr-FR', {
          style: 'decimal',
          minimumFractionDigits: 0
        }).format(value);
      }

    const OneUser = useSelector((state: RootState) => state.OneUserSlice)
    const [decoded, setDecoded] = useState({
        id: 0,
        email: "",
        status: "1",
        createdAt: "",
        role: "",
        person: {
            id: 7,
            name: "",
            createdAt: "",
            deletedAt: null,
        }
    }) as any;



    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setDecoded(decoded as any)
        }
    }, [])
    useEffect(()=>{
        dispatch(OneUserAsync(decoded.id))
      },[decoded.id])


    useEffect(() => {
        dispatch(OneUserAsync(decoded.id))
    }, [])




    const DataStock = useSelector((state: RootState) => state.StockSlice.data)
    const [stockSelected, SetstockSelected] = useState(null);
    const [search, Setsearch] = useState("");
    const [DataStockCateg, setDataStockCateg] = useState(DataStock)
    const overlayDrop3 = useRef(null) as any;
    const [showCateg, setShowCateg] = useState(false)
    const [searchCateg, setSearchCateg] = useState("")

    const [data, setData] = useState({
        quantite: 0,
        prix_unitaire: '',
        status: "",
        mode_paiement: "",
        TVA: 0,
        total_HT: 0,
        total_TTC: 0,
        admin: (OneUser.data?.person as any)?.id as any,
        stock: 0
    })

    const InputSearchCateg = (e) => {
        // setData({ ...data, prix_unitaire:0,quantite:0 })

        // setData({ ...data, prix_unitaire:0,quantite:0 })

        let value = e.target.value

        SetstockSelected(null)
        setSearchCateg(value)
        if (value != "") {
            setDataStockCateg(DataStock.filter((item) => ((item?.designation).toLowerCase()).includes(value.toLowerCase()) || (item?.code_items).toLowerCase().includes(value.toLowerCase())))
            setData({ ...data, stock: stockSelected })

            change(index, { ...data, designation: stockSelected?.designation })
            change(index, { ...data, prix_unitaire: "", quantite: "" })
        } else {
            setDataStockCateg(DataStock)
            setData({ ...data, stock: stockSelected })
            change(index, { ...data, designation: stockSelected?.designation })
            change(index, { ...data, prix_unitaire: 0, quantite: 0 })

        }
    }
    const handleChange = (item: number | string, value) => {
        // setData(prev => ({ ...prev, designation :  item.value}))
        setData({ ...data, [item]: value })
        change(index, { ...data, [item]: Number(value) })

    }
    useEffect(() => {
        if (stockSelected) {

            setData({ ...data, stock: stockSelected, prix_unitaire: stockSelected.prix_affiche })
            change(index, { ...data, stock: stockSelected, prix_unitaire: stockSelected.prix_affiche })

        }
         
    }, [stockSelected]);

    useEffect(() => {

        // new Date(new Date(e.prochaine).toDateString())


        const handleClickOutside = (e: Event | any) => {
            if (overlayDrop3.current && !overlayDrop3.current.contains(e.target)) {
                setShowCateg(false);
            }
            // if (overlayDrop2.current && !overlayDrop2.current.contains(e.target)) {
            //   setIsOpen2(false);
            // }

        };
        // parMode()
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };




    }, []);
    useEffect(() => {

        setDataStockCateg(DataStock)
    }, [DataStock])
    useEffect(() => {
        dispatch(StockAsync())
    }, [])
     
    return <>
        <div className="border bg-white-50 rounded border-s-500 relative p-4 gap-4">
            {
                index != 0 &&
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => remove(index)}
                >
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            }
            <div className="flex gap-2">
                <div className="flex-grow">
                    <label className="text-sm font-medium mb-1 block">Désignation {
                        stockSelected != null &&
                        <span className="text-gray-500 ml-4 text-sm"> ( {stockSelected?.quantite} en stock(s) )</span>
                    } </label>
                    <div>
                        <div>
                            <div className="relative" ref={overlayDrop3}>
                                <input type="text" style={{ fontSize: "14px" }} value={value.stock?.designation} onChange={(e) => { (e.target.value?.trim() != "" ? setShowCateg(true) : setShowCateg(false)), InputSearchCateg(e) }} onClick={() => setShowCateg(true)} placeholder="Sélectionner..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-s" />
                                {
                                    showCateg &&
                                    <div className="list-option z-30 absolute top-[100%] mt-1 w-full bg-white">
                                        <ul className="max-h-48 rounded-md border border-input overflow-auto">
                                            {DataStockCateg.map(cat => (
                                                <li onClick={() => { SetstockSelected(null), dispatch(changeMsg("")), setSearchCateg(`${cat?.designation} ~ ${cat.categorie}`), setShowCateg(false), SetstockSelected(cat) }} key={cat.id} style={{ fontSize: "11px" }} value={cat?.designation} className="relative cursor-pointer flex w-full hover:bg-slate-300 select-none items-center rounded-sm py-2 pl-4 pr-2 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">{cat?.designation} ~ {cat.code_items}</li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            </div>
                        </div>


                    </div>
                </div>
                <div className="w-20">
                    <label className="text-sm flex font-medium mb-1 ">Quantité  </label>

                    <Input type="number" disabled={!value.stock?.designation || value.stock?.quantite == 0} value={value.stock?.quantite == 0 ? 0 : value.quantite} onChange={(e) => handleChange("quantite", e.target.value)} placeholder="0" min="0" />

                </div>

                <div className="w-36">
                    <label className="text-sm font-medium mb-1 block">Prix unitaire  (Ar)</label>
                    <Input type="number"  disabled={!value.stock?.designation} placeholder={(!stockSelected?.prix_affiche) ? "Séléctionner un stock..." : ` ${stockSelected?.prix_affiche} Ar - ${stockSelected?.dernier_prix} Ar`} value={(value.prix_unitaire)} onChange={(e) => handleChange("prix_unitaire", (e.target.value))} />
                    {/* <p>le prix doit être entre {`${stockSelected.prix_affiche} Ar ---- ${stockSelected.dernier_prix} Ar`}</p> */}
                </div>
            </div>



        </div>
    </>
}
export default ClickOutside