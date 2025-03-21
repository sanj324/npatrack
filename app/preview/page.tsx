import Link from "next/link"

export default function Preview() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">NPA Data Preview</h1>
        <p className="text-center mb-6 text-blue-600">
          Your NPA data has been successfully imported. In a real application, you would see a preview of your NPA data
          here.
        </p>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">Sample NPA Data:</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Account No.</th>
                <th className="border border-gray-300 p-2">Outstanding Amount</th>
                <th className="border border-gray-300 p-2">Days Past Due</th>
                <th className="border border-gray-300 p-2">NPA Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">AC001</td>
                <td className="border border-gray-300 p-2">₹500,000</td>
                <td className="border border-gray-300 p-2">120</td>
                <td className="border border-gray-300 p-2">Substandard</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">AC002</td>
                <td className="border border-gray-300 p-2">₹750,000</td>
                <td className="border border-gray-300 p-2">365</td>
                <td className="border border-gray-300 p-2">Doubtful</td>
              </tr>
              {/* Add more sample rows as needed */}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center space-x-4">
          <Link
            href="/import"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Back to Import
          </Link>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Generate NPA Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

