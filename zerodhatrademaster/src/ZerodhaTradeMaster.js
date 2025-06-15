import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
function ZerodhaTradeMaster() {
  // Tab state: 0 = Portfolio, 1 = Orders, 2 = Market Alerts, 3 = Recommendations, 4 = Stock Analysis
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    { label: "Portfolio" },
    { label: "Orders" },
    { label: "Market Alerts" },
    { label: "Recommendations" },
    { label: "Stock Analysis" },
  ];

  // PUBLIC_INTERFACE
  function renderTab() {
    switch (currentTab) {
      case 0:
        return <PortfolioTab />;
      case 1:
        return <OrdersTab />;
      case 2:
        return <MarketAlertsTab />;
      case 3:
        return <RecommendationsTab />;
      case 4:
        return <StockAnalysisTab />;
      default:
        return null;
    }
  }

  return (
    <section className="ztm__main-container">
      <header className="ztm__header">
        <div className="ztm__header-title">
          <span className="ztm__brand" style={{ color: "#0d6efd" }}>
            Zerodha
          </span>
          <span>TradeMaster</span>
        </div>
      </header>
      <nav className="ztm__tabs">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`ztm__tab-btn${currentTab === idx ? " active" : ""}`}
            onClick={() => setCurrentTab(idx)}
            tabIndex={0}
            aria-label={tab.label}
            style={
              currentTab === idx
                ? { color: "#0d6efd", borderBottom: "2px solid #0d6efd", background: "none" }
                : { color: "#6c757d", background: "none" }
            }
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="ztm__tab-content">{renderTab()}</main>
    </section>
  );
}

// ======================== Portfolio Tab ======================== //
function PortfolioTab() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch portfolio (replace with actual API in prod)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPortfolio([
        {
          symbol: "RELIANCE",
          qty: 15,
          avgPrice: 2375,
          lastTradedPrice: 2412,
          profitLoss: +555,
          profitPercent: +1.55,
        },
        {
          symbol: "TCS",
          qty: 10,
          avgPrice: 3130,
          lastTradedPrice: 3070,
          profitLoss: -600,
          profitPercent: -1.91,
        },
        // More... 
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const totalPL = portfolio.reduce((acc, s) => acc + s.profitLoss, 0);

  return (
    <div className="ztm__portfolio">
      <h2 className="ztm__tab-title">Portfolio</h2>
      {loading ? (
        <div className="ztm__loading">Loading portfolio...</div>
      ) : (
        <>
          <div className="ztm__portfolio-summary">
            <strong>Total P/L:</strong>{" "}
            <span style={{ color: totalPL >= 0 ? "#198754" : "#dc3545" }}>
              ₹{totalPL >= 0 ? "+" : ""}
              {totalPL.toLocaleString()}
            </span>
            <ProfitBookButton />
          </div>

          <table className="ztm__table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Avg Price</th>
                <th>LTP</th>
                <th>P/L (₹)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((stock) => (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>{stock.qty}</td>
                  <td>₹{stock.avgPrice}</td>
                  <td>₹{stock.lastTradedPrice}</td>
                  <td style={{ color: stock.profitLoss >= 0 ? "#198754" : "#dc3545" }}>
                    {stock.profitLoss >= 0 ? "+" : ""}
                    {stock.profitLoss} ({stock.profitPercent >= 0 ? "+" : ""}
                    {stock.profitPercent}%)
                  </td>
                  <td>
                    <StopLossButton symbol={stock.symbol} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

// Bulk profit booking button - stub
function ProfitBookButton() {
  // PUBLIC_INTERFACE
  function handleBulkBook() {
    // Mount API logic here
    window.alert("Bulk profit booking triggered for profitable holdings!");
  }
  return (
    <button className="ztm__btn-accent" onClick={handleBulkBook}>
      Bulk Profit Booking
    </button>
  );
}

// Stop loss order button - stub
function StopLossButton({ symbol }) {
  // PUBLIC_INTERFACE
  function handleStopLoss() {
    // Trigger modal or send API to place stop loss
    window.alert("Place stop loss order for " + symbol);
  }
  return (
    <button className="ztm__btn-secondary" onClick={handleStopLoss}>
      Stop Loss
    </button>
  );
}

// ======================== Orders Tab ======================== //
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState({ symbol: "", qty: "", side: "BUY" });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          symbol: "INFY",
          qty: 20,
          price: 1500,
          side: "BUY",
          status: "OPEN",
          time: "09:30",
        },
        {
          id: 2,
          symbol: "SBIN",
          qty: 12,
          price: 570,
          side: "SELL",
          status: "EXECUTED",
          time: "09:36",
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  // PUBLIC_INTERFACE
  function handleOrderSubmit(e) {
    e.preventDefault();
    if (!newOrder.symbol || !newOrder.qty) return;
    // Call order API
    setOrders([
      {
        id: Math.random(),
        symbol: newOrder.symbol.toUpperCase(),
        qty: +newOrder.qty,
        price: 0,
        side: newOrder.side,
        status: "OPEN",
        time: new Date().toLocaleTimeString().slice(0, 5),
      },
      ...orders,
    ]);
    setNewOrder({ symbol: "", qty: "", side: "BUY" });
  }

  // PUBLIC_INTERFACE
  function cancelOrder(id) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "CANCELLED" } : o))
    );
  }

  return (
    <div className="ztm__orders">
      <h2 className="ztm__tab-title">Orders</h2>
      <form className="ztm__order-form" onSubmit={handleOrderSubmit}>
        <input
          className="ztm__input"
          type="text"
          placeholder="Symbol (e.g. TCS)"
          value={newOrder.symbol}
          onChange={(e) => setNewOrder({ ...newOrder, symbol: e.target.value })}
          required
        />
        <input
          className="ztm__input"
          type="number"
          min="1"
          placeholder="Quantity"
          value={newOrder.qty}
          onChange={(e) => setNewOrder({ ...newOrder, qty: e.target.value })}
          required
        />
        <select
          className="ztm__input"
          value={newOrder.side}
          onChange={(e) => setNewOrder({ ...newOrder, side: e.target.value })}
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <button className="ztm__btn-primary" type="submit">
          Place Order
        </button>
      </form>

      {loading ? (
        <div className="ztm__loading">Loading orders...</div>
      ) : (
        <table className="ztm__table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Qty</th>
              <th>Side</th>
              <th>Status</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.time}</td>
                <td>{o.symbol}</td>
                <td>{o.qty}</td>
                <td style={{ color: o.side === "BUY" ? "#0d6efd" : "#6c757d" }}>{o.side}</td>
                <td>
                  <span
                    style={{
                      color:
                        o.status === "EXECUTED"
                          ? "#198754"
                          : o.status === "CANCELLED"
                          ? "#dc3545"
                          : "#ffc107",
                      fontWeight: o.status === "OPEN" ? 500 : 400,
                    }}
                  >
                    {o.status}
                  </span>
                </td>
                <td>
                  {o.status === "OPEN" && (
                    <button
                      className="ztm__btn-secondary ztm__btn-cancel"
                      onClick={() => cancelOrder(o.id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ======================== Market Alerts Tab ======================== //
function MarketAlertsTab() {
  const [alerts, setAlerts] = useState([]);
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setAlerts([
        {
          id: 1,
          type: "NIFTY Drop",
          desc: "NIFTY index dropped below 18500",
          level: "Warning",
          time: "11:10",
        },
        {
          id: 2,
          type: "BankNIFTY Surge",
          desc: "BankNIFTY up +2.1%",
          level: "Info",
          time: "09:49",
        },
      ]);
    }, 800);
  }, []);

  // PUBLIC_INTERFACE
  function handleToggleAlerts() {
    setEnabled((v) => !v);
  }

  return (
    <div className="ztm__market-alerts">
      <h2 className="ztm__tab-title">Market Alerts</h2>
      <div className="ztm__alerts-settings">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggleAlerts}
          />{" "}
          Enable Market Alerts
        </label>
      </div>
      <ul className="ztm__alerts-list">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`ztm__alert-item ztm__alert-${alert.level.toLowerCase()}`}
          >
            <span className="ztm__alert-type">{alert.type}</span>
            <span className="ztm__alert-desc">{alert.desc}</span>
            <span className="ztm__alert-time">{alert.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ======================== Recommendations Tab ======================== //
function RecommendationsTab() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRecommendations([
        {
          symbol: "RELIANCE",
          recommendation: "BUY",
          rationale: "Uptrend, strong Q earnings, target: ₹2500",
        },
        {
          symbol: "DIVISLAB",
          recommendation: "SELL",
          rationale: "Bearish momentum, Q1 profit dip",
        },
        {
          symbol: "BANKNIFTY 44500 CE",
          recommendation: "BUY",
          rationale: "Option OI spike, expected short covering",
        },
      ]);
      setLoading(false);
    }, 700);
  }, []);

  return (
    <div className="ztm__recommendations">
      <h2 className="ztm__tab-title">Recommendations</h2>
      {loading ? (
        <div className="ztm__loading">Fetching latest signals...</div>
      ) : (
        <table className="ztm__table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Recommendation</th>
              <th>Rationale</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec) => (
              <tr key={rec.symbol}>
                <td>{rec.symbol}</td>
                <td
                  style={{
                    color:
                      rec.recommendation === "BUY"
                        ? "#198754"
                        : rec.recommendation === "SELL"
                        ? "#dc3545"
                        : "#6c757d",
                  }}
                >
                  {rec.recommendation}
                </td>
                <td>{rec.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ======================== Stock Analysis Tab ======================== //
function StockAnalysisTab() {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Retrieve historical data (stub)
  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setTimeout(() => {
      setHistory([
        { date: "2024-05-05", price: 2420, event: "Earnings Release" },
        { date: "2024-04-12", price: 2392, event: "Dividend announcement" },
        { date: "2024-03-25", price: 2280, event: "Market rally" },
      ]);
      setLoading(false);
    }, 700);
  }, [symbol]);

  return (
    <div className="ztm__stock-analysis">
      <h2 className="ztm__tab-title">Stock Analysis</h2>
      <form
        className="ztm__stock-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          className="ztm__input"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol (e.g. INFY)"
        />
      </form>
      {loading ? (
        <div className="ztm__loading">Loading history data...</div>
      ) : (
        <table className="ztm__table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Price (₹)</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>₹{item.price}</td>
                <td>{item.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: 16 }}>
        <RiskRecommendation symbol={symbol} />
      </div>
    </div>
  );
}

// Dummy Risk Recommendation (would call API)
function RiskRecommendation({ symbol }) {
  return (
    <div className="ztm__risk-box">
      <h4>Risk Management</h4>
      <small>
        <span style={{ color: "#ffc107" }}>Stop Loss</span>: Recommended ₹
        {symbol === "RELIANCE" ? "2380" : "Auto"} <br />
        Margin Usage: <span style={{ color: "#dc3545" }}>76%</span>
      </small>
    </div>
  );
}

export default ZerodhaTradeMaster;
