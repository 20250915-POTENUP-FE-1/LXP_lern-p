export type MockItem = {
  id: number;
  title: string;
};

export const MOCK_ITEMS: MockItem[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  title: `아이템 ${i + 1}`,
}));
