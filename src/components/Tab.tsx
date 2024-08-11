import { TabElement } from "../types/types";

interface Props {
  tab: TabElement;
  isSelected: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>, tab: TabElement) => void;
}

export const Tab = (props: Props) => {
  const { tab, isSelected, onClick } = props;

  if (isSelected) {
    return (
      <li className="me-2" onClick={(e) => onClick(e, tab)}>
        <a
          href={tab.href}
          className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
        >
          {tab.label}
        </a>
      </li>
    );
  }

  return (
    <li className="me-2" onClick={(e) => onClick(e, tab)}>
      <a
        href={tab.href}
        className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      >
        {tab.label}
      </a>
    </li>
  );
};
