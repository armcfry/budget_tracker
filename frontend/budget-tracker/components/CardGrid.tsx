type CardGridProps<T> = {
    items: T[];
    keyExtractor: (item: T) => string | number;
    renderItem: (item: T) => React.ReactNode;
    columns?: string;
    emptyMessage?: string;
};

export default function CardGrid<T>({
    items,
    keyExtractor,
    renderItem,
    columns = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    emptyMessage = "No items found.",
}: Readonly<CardGridProps<T>>) {
    if (items.length === 0) {
        return (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {emptyMessage}
            </p>
        );
    }

    return (
        <div className={`grid ${columns} gap-3 sm:gap-4`}>
            {items.map((item) => (
                <div key={keyExtractor(item)} className="h-full">
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
}