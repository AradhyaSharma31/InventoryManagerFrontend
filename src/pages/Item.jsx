import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import "../CSS/Shop.css";
import axios from "axios";

export default function Shop() {
  const navigate = useNavigate();
  const [item, SetItem] = useState({ ItemName: null });
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(false);

  // Matching id from URL using useParams() hook
  const { id, CategoryID, ItemID } = useParams();

  useEffect(() => {
    const FetchAPI = async () => {
      try {
        const response = await axios.get(
          `https://inventorymanagerbackend.onrender.com/shops/${id}/stockroom/categories/${CategoryID}/${ItemID}`
        );

        if (response.data.AuthenticationError) {
          // Authentication error
          // Navigate to '/shops' if an authentication verification issue is detected.
          navigate("/shops", {
            state: {
              msg: response.data.AuthenticationError.msg,
              status: response.data.AuthenticationError.status,
            },
          });
        } else if (response.data.AuthorizationError) {
          // Authorization error
          // Navigate to '/shops' if an authorization issue is detected.
          navigate("/shops", {
            state: {
              msg: response.data.AuthorizationError.msg,
              status: response.data.AuthorizationError.status,
            },
          });
        } else if (response.data.GeneralError) {
          navigate("/GeneralError", {
            state: {
              msg:
                response.data.GeneralError.msg || "Oops! Something went wrong",
              StatusCode: response.data.GeneralError.StatusCode,
            },
          });
        } else {
          // No error detected
          SetItem(response.data.item);
        }
      } catch (FrontendError) {
        console.error(FrontendError.message);
        navigate("/GeneralError", {
          state: {
            msg: FrontendError.message || "Oops! Something went wrong",
            StatusCode: FrontendError.StatusCode,
          },
        });
      }
    };
    FetchAPI();
  }, []);

  // Getting the reference of MutationObserver obj to observe darkmode class of HTML element
  useEffect(() => {
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="shop flex-1 p-1">
      {!item.ItemName ? (
        <div className="grid place-items-center h-screen">
          <span className={IsDarkModeActive ? "SpinnerAtDark" : "SpinnerAtLight"}></span>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div
            className={
              IsDarkModeActive
                ? "BoxAtDark w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-1 md:p-2 rounded"
                : "BoxShadowAtLight w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-1 md:p-2 rounded"
            }
          >
            <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">{}</h2>
            <p className="text-sm md:text-md lg:text-lg">
              <b>{item.ItemName}(name)</b>
            </p>
            <p className="overflow-hidden text-xs md:text-sm lg:text-md">
              {item.ItemDescription}(description)
            </p>
            <p className="leading-tight text-xs md:text-sm lg:text-md">
              &#8377;{item.PerItemPurchasePrice}(per item purchase price)
            </p>
            <p className="leading-tight text-xs md:text-sm lg:text-md">
              &#8377;{item.PerItemSellingPrice}(per item selling price)
            </p>
            <img className="w-full rounded" src={item.ItemPath} alt="" />
            <p className="text-xs md:text-sm lg:text-md">
              {item.NoOfItems}(no of items)
            </p>
            <p className="leading-tight text-xs md:text-sm lg:text-md">
              {item.PerItemSellingDiscount}&#37;(per item discount)
            </p>
            {item.StockStatus == "Available" ? (
              <p className="leading-tight text-green-700 text-xs md:text-sm lg:text-md">
                {item.StockStatus}
                <span
                  className={
                    IsDarkModeActive
                      ? "leading-tight text-white text-xs md:text-sm lg:text-md"
                      : "leading-tight text-black text-xs md:text-sm lg:text-md"
                  }
                >
                  (stock status)
                </span>
              </p>
            ) : (
              <p className="leading-tight text-red-600 text-xs md:text-sm lg:text-md">
                {item.StockStatus}
                <span
                  className={
                    IsDarkModeActive
                      ? "leading-tight text-white text-xs md:text-sm lg:text-md"
                      : "leading-tight text-black text-xs md:text-sm lg:text-md"
                  }
                >
                  (stock status)
                </span>
              </p>
            )}
            {item.PaymentStatus == "Available" ? (
              <p className="leading-tight text-green-700 text-xs md:text-sm lg:text-md">
                {item.PaymentStatus}
                <span
                  className={
                    IsDarkModeActive
                      ? "leading-tight text-white text-xs md:text-sm lg:text-md"
                      : "leading-tight text-black text-xs md:text-sm lg:text-md"
                  }
                >
                  (stock status)
                </span>
              </p>
            ) : (
              <p className="leading-tight text-red-600 text-xs md:text-sm lg:text-md">
                {item.PaymentStatus}
                <span
                  className={
                    IsDarkModeActive
                      ? "leading-tight text-white text-xs md:text-sm lg:text-md"
                      : "leading-tight text-black text-xs md:text-sm lg:text-md"
                  }
                >
                  (stock status)
                </span>
              </p>
            )}

            <div className="flex justify-around mt-1">
              <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-green-400 text-black rounded">
                <a href={`/shops/${id}/stockroom/categories/${CategoryID}`}>
                  View all items
                </a>
              </button>
              <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 TangerineColor text-black rounded">
                <a
                  href={`/shops/${id}/stockroom/categories/${CategoryID}/${ItemID}/edit`}
                >
                  Edit item
                </a>
              </button>
              <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 PrussianBlueColor text-white rounded">
                <a href={`/shops/${id}/stockroom`}>Stockroom</a>
              </button>
              <button className="text-nowrap text-xs md:text-sm lg:text-md px-2 py-1 md:px-3 md:py-2 bg-red-400 text-black rounded">
                <a
                  href={`/shops/${id}/stockroom/categories/${CategoryID}/${ItemID}/ConfirmDeleteItem`}
                >
                  Delete item
                </a>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
