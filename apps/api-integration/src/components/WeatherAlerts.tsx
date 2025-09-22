import { WeatherData } from "../types/app.types";

interface WeatherAlertsProps {
  weatherData: WeatherData;
}

const WeatherAlerts = ({ weatherData }: WeatherAlertsProps) => {
  // Check if alerts data exists
  if (!weatherData.alerts || !weatherData.alerts.alert || weatherData.alerts.alert.length === 0) {
    return (
      <div className="weather-alerts-container">
        <h3>Weather Alerts</h3>
        <div className="no-alerts">
          <p>No active weather alerts for this location</p>
        </div>
      </div>
    );
  }

  // Get severity color based on alert severity
  const getSeverityColor = (severity: string): string => {
    switch (severity.toLowerCase()) {
      case 'extreme':
        return '#d32f2f'; // red
      case 'severe':
        return '#f44336'; // lighter red
      case 'moderate':
        return '#ff9800'; // orange
      case 'minor':
        return '#ffeb3b'; // yellow
      default:
        return '#2196f3'; // blue for unknown
    }
  };

  // Format date for better readability
  const formatAlertDate = (dateStr: string): string => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="weather-alerts-container">
      <h3>Weather Alerts</h3>
      
      <div className="alerts-list">
        {weatherData.alerts.alert.map((alert, index) => (
          <div 
            key={index} 
            className="alert-item"
            style={{ borderLeft: `4px solid ${getSeverityColor(alert.severity)}` }}
          >
            <div className="alert-header">
              <h4 className="alert-headline">{alert.headline}</h4>
              <span 
                className="alert-severity" 
                style={{ backgroundColor: getSeverityColor(alert.severity) }}
              >
                {alert.severity}
              </span>
            </div>
            
            <div className="alert-details">
              <p className="alert-description">{alert.desc}</p>
              <p className="alert-areas"><strong>Areas:</strong> {alert.areas}</p>
              <div className="alert-timing">
                <span><strong>Effective:</strong> {formatAlertDate(alert.effective)}</span>
                <span><strong>Expires:</strong> {formatAlertDate(alert.expires)}</span>
              </div>
              <p className="alert-urgency"><strong>Urgency:</strong> {alert.urgency}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts; 
