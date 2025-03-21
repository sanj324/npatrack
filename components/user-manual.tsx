import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UserManual() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">NPA Management System User Manual</CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-none">
        <h2>Table of Contents</h2>
        <ol>
          <li>
            <a href="#introduction">Introduction</a>
          </li>
          <li>
            <a href="#accessing-the-dashboard">Accessing the Dashboard</a>
          </li>
          <li>
            <a href="#understanding-the-charts">Understanding the Charts</a>
          </li>
          <li>
            <a href="#interacting-with-charts">Interacting with Charts</a>
          </li>
          <li>
            <a href="#interpreting-detailed-information">Interpreting Detailed Information</a>
          </li>
          <li>
            <a href="#troubleshooting">Troubleshooting</a>
          </li>
        </ol>

        <h2 id="introduction">1. Introduction</h2>
        <p>
          Welcome to the NPA Management System User Manual. This guide will help you navigate and utilize the various
          charts and features available in the system, enabling you to gain valuable insights into Non-Performing Assets
          (NPAs) data.
        </p>

        <h2 id="accessing-the-dashboard">2. Accessing the Dashboard</h2>
        <p>To access the NPA Management Dashboard:</p>
        <ol>
          <li>Log in to the Co-operative Bank MIS system.</li>
          <li>Navigate to the "Dashboard" section from the main menu.</li>
          <li>You will see a grid of various charts representing different aspects of NPA data.</li>
        </ol>

        <h2 id="understanding-the-charts">3. Understanding the Charts</h2>
        <p>The dashboard presents several types of charts, each providing unique insights:</p>
        <ul>
          <li>
            <strong>NPA Trend Analysis:</strong> Shows the trend of NPA percentage over time.
          </li>
          <li>
            <strong>Loan Type-wise NPA Distribution:</strong> Displays NPA amounts across different loan types.
          </li>
          <li>
            <strong>Branch-wise NPA Analysis:</strong> Illustrates NPA distribution across different branches.
          </li>
          <li>
            <strong>Aging Analysis of NPA:</strong> Categorizes NPAs based on their age.
          </li>
          <li>
            <strong>Recovery vs Fresh NPAs:</strong> Compares new NPAs with recovery amounts over time.
          </li>
          <li>
            <strong>Secured vs Unsecured Loans:</strong> Shows the distribution of NPAs between secured and unsecured
            loans.
          </li>
        </ul>

        <h2 id="interacting-with-charts">4. Interacting with Charts</h2>
        <p>Each chart is interactive and allows you to:</p>
        <ul>
          <li>
            <strong>Hover:</strong> Move your cursor over chart elements to see tooltips with detailed information.
          </li>
          <li>
            <strong>Click:</strong> Click on chart elements (bars, pie slices, data points) to open a detailed
            information dialog.
          </li>
          <li>
            <strong>Zoom:</strong> Some charts may allow zooming for a closer look at specific data ranges.
          </li>
          <li>
            <strong>Legend Interaction:</strong> Click on legend items to toggle the visibility of specific data series.
          </li>
        </ul>

        <h2 id="interpreting-detailed-information">5. Interpreting Detailed Information</h2>
        <p>
          When you click on a chart element, a dialog box will appear with detailed information. This typically
          includes:
        </p>
        <ul>
          <li>
            <strong>Number of Accounts:</strong> The count of NPA accounts related to the selected data point.
          </li>
          <li>
            <strong>Total NPA Amount:</strong> The sum of NPA amounts for the selected category.
          </li>
          <li>
            <strong>Total Sanction Amount:</strong> The total sanctioned amount for the accounts in the selected
            category.
          </li>
          <li>
            <strong>NPA Percentage:</strong> The percentage of NPA amount relative to the total sanction amount.
          </li>
          <li>
            <strong>Recovery Amount:</strong> (if applicable) The amount recovered for the selected category.
          </li>
          <li>
            <strong>Recovery Percentage:</strong> (if applicable) The percentage of recovered amount relative to the
            total NPA amount.
          </li>
        </ul>

        <h2 id="troubleshooting">6. Troubleshooting</h2>
        <p>If you encounter any issues:</p>
        <ul>
          <li>
            <strong>Charts not loading:</strong> Refresh the page. If the problem persists, check your internet
            connection.
          </li>
          <li>
            <strong>No data displayed:</strong> Ensure that you have imported NPA data into the system.
          </li>
          <li>
            <strong>Incorrect data:</strong> Verify the data import process and check the source data for any
            discrepancies.
          </li>
          <li>
            <strong>Browser compatibility:</strong> Use the latest version of Chrome, Firefox, or Edge for optimal
            performance.
          </li>
        </ul>
        <p>For any additional support or questions, please contact your system administrator or the IT support team.</p>
      </CardContent>
    </Card>
  )
}

