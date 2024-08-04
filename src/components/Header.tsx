import { useState } from "react";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "./ConfirmModal";
import { checkLoggedIn, clearJwtFromCookie } from "../utils/funcs";
import { useNavigate } from "react-router-dom";

export interface Props {
  username?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header(props: Props) {
  const { username } = props;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(checkLoggedIn());
  const navigate = useNavigate();

  const handleLogout = () => {
    clearJwtFromCookie();
    setConfirmModalShow(false);
    // ホーム画面に遷移
    navigate("/");
    navigate(0);
  };

  const onCancel = () => {
    setConfirmModalShow(false);
  };

  const onClickLogout = () => {
    setConfirmModalShow(true);
  };

  return (
    <header className="bg-white">
      {confirmModalShow && (
        <ConfirmModal
          isOpen={true}
          desc="ログアウトします。よろしいですか？"
          cancelLabel="キャンセル"
          proceedLabel="OK"
          onProceed={handleLogout}
          onCancel={onCancel}
          open={confirmModalShow}
          setOpen={() => setConfirmModalShow}
        />
      )}
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              // stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                // stroke-linecap="round"
                // stroke-linejoin="round"
                d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288"
              />
            </svg>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {!isLoggedIn && (
            <>
              <a
                href="/login"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                ログイン
              </a>
              <a
                href="/register"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                新規登録
              </a>
            </>
          )}
          {isLoggedIn && username && (
            <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900">
              Welcome! {username}
            </div>
          )}
          {isLoggedIn && (
            <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
              <button onClick={onClickLogout}>ログアウト</button>
            </div>
          )}
        </PopoverGroup>
      </nav>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                // stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="py-6">
                {!isLoggedIn && (
                  <>
                    <a
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      ログイン
                    </a>
                    <a
                      href="/register"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      新規登録
                    </a>
                  </>
                )}
                {isLoggedIn && username && (
                  <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900">
                    Welcome! {username}
                  </div>
                )}
                {isLoggedIn && (
                  <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    <button onClick={onClickLogout}>ログアウト</button>
                  </div>
                )}
              </div>
              <div className="py-6"></div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
