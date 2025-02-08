// src/components/SignerList.js
export default function SignerList({ signers }) {
  return (
    <div className="space-y-2">
      {signers.length === 0 ? (
        <p className="text-gray-500 text-sm">No signers added yet</p>
      ) : (
        signers.map((signer, index) => (
          <div key={index} className="border rounded-lg p-3 text-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{signer.email}</p>
                <p className="text-gray-500">
                  {signer.role} - Page {signer.page}
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  signer.status === "SIGNED"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {signer.status}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
