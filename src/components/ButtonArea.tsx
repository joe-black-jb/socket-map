import Button from "./Button";

export const ButtonArea = () => {
  return (
    <div className="mt-4 ml-4 flex justify-start">
      <p className="my-auto px-2">
        マップ上の地点を選択し「登録」ボタンを押すと新しい場所を登録できます
      </p>
      <Button label="登録" />
    </div>
  );
};
