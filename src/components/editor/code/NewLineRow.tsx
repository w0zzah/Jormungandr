import type {ReactNode} from "react";
import Row from "@/components/ui/row";
import Gutter from "@/components/ui/gutter";

export default function NewLineRow({ children }: { children: ReactNode }) {
    return (
        <Row>
            <Gutter>+</Gutter>
            {children}
        </Row>
    );
}
