// src/components/SignerForm.js
export default function SignerForm({ formData, onChange, onSubmit, disabled }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={formData.role}
          onChange={(e) => onChange({ ...formData, role: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="ROLE_1">Role 1</option>
          <option value="ROLE_2">Role 2</option>
          <option value="ROLE_3">Role 3</option>
        </select>
      </div>

      {formData.position && (
        <div className="text-sm text-gray-600">
          Selected Position: Page {formData.page}, X:{" "}
          {formData.position.x.toFixed(2)}%, Y: {formData.position.y.toFixed(2)}
          %
        </div>
      )}

      <button
        type="submit"
        disabled={disabled || !formData.position}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        Add Signer
      </button>
    </form>
  );
}
