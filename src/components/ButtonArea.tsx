import Button from "./Button";

interface Props {
  label?: string;
  disabled?: boolean;
  onClick: () => void;
}

export const ButtonArea = (props: Props) => {
  const { label, disabled, onClick } = props;
  return (
    <div className="mt-4 mx-4 flex justify-end">
      <p className="my-auto px-2">
        マップ上の地点を選択し「登録」ボタンを押すと新規登録できます
      </p>

      <Button label={label || "OK"} onClick={onClick} disabled={disabled} />
    </div>
  );
};
