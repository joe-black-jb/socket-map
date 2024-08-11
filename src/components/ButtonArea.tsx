import Button from "./Button";

export const ButtonArea = () => {
  return (
    <div className="mt-4 mx-4 flex justify-end">
      <p className="my-auto px-2">
        マップ上の地点を選択し「登録」ボタンを押すと新規登録できます
      </p>
      <Button label="登録" />
    </div>
  );
};
