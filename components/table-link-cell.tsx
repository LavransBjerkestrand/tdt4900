import Link from 'next/link';
import { Table } from '@radix-ui/themes';

export function TableLinkCell_({ children, href }: { children: React.ReactNode; href: string; }) {
  return (
    <Table.Cell style={{ padding: 0, height: 1 }}>
      <div className="h-full">
        <Link href={href}>
          <div className="h-full p-3">{children}</div>
        </Link>
      </div>
    </Table.Cell>
  );
}
