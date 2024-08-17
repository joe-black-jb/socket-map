import { useState } from "react";
import { PopoverGroup } from "@headlessui/react";
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

export default function Header2(props: Props) {
  const { username } = props;

  const [menuOpen, setMenuOpen] = useState(false);
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

  const toggleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="bg-white absolute top-2 left-2 z-40">
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
        className="mx-auto flex max-w-7xl items-center justify-between"
        aria-label="Global"
      >
        <div className="flex">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2 text-gray-700"
            onClick={toggleMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon
              className="rounded-full hover:bg-gray-200 ml-2 mt-0.5 p-1 size-8 top-3 right-2 items-center cursor-pointer text-gray-500"
              aria-hidden="true"
            />
          </button>
        </div>
        <PopoverGroup className="hidden">
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
      {menuOpen && (
        <div className="z-70">
          <div className="fixed inset-0 z-70" />
          <div className="fixed inset-y-0 left-0 z-70 overflow-y-auto bg-white px-6 py-6 w-1/2 sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="size-6"
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={closeMenu}
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
          </div>
        </div>
      )}
    </div>
  );
}
