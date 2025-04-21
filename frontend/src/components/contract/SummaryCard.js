import React from "react"; // Import React library
import "../../styles/contract/SummaryCard.css"; // Import the CSS file for styling
export default function SummaryCard({ title, value, change }) {
    return (
        <div className="summary-card">
            <h2 className="summary-card-title">{title}</h2>
            <div className="summary-card-value">{value}</div>
            <div className={`summary-card-change ${change.startsWith('+') ? 'positive' : 'negative'}`}>
                {change} <span>vs last month</span>
            </div>
        </div>
    )
}