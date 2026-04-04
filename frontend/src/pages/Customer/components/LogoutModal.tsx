import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { LogOut, AlertTriangle } from 'lucide-react' // Using Lucide to match your other icons

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 sm:my-8 sm:w-full sm:max-w-md"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-50 sm:mx-0 sm:size-10">
                  <AlertTriangle className="size-5 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-lg font-bold text-slate-800">
                    Confirm Logout
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-slate-500">
                      Are you sure you want to log out of your account? You will need to sign in again to access your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex w-full justify-center rounded-xl bg-[#7c1c1c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-800 sm:w-auto transition-colors"
              >
                Logout Now
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 sm:mt-0 sm:w-auto transition-colors"
              >
                Stay Logged In
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}