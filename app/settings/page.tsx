export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">⚙️ Settings</h1>
        <p className="text-gray-600 mt-2">System configuration and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* User Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">👤 User Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value="admin@firecycle.ai"
                readOnly
                className="mt-1 w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select className="mt-1 w-full px-4 py-2 border rounded-lg">
                <option>ADMIN</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Update Profile
            </button>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🗄️ Database Configuration</h2>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-600">
              Database connection configured via <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code>
            </p>
            <p className="text-xs text-gray-600 mt-2">Environment: Development</p>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔌 AI Copilot Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">AI Provider</label>
              <select className="mt-1 w-full px-4 py-2 border rounded-lg">
                <option>OpenAI-compatible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Base URL</label>
              <input
                type="text"
                placeholder="https://api.openai.com/v1"
                className="mt-1 w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Test Connection
            </button>
          </div>
        </div>

        {/* Application Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">ℹ️ Application Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Build Date</span>
              <span className="font-semibold">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Environment</span>
              <span className="font-semibold">Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="font-semibold">PostgreSQL (Prisma ORM)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
