import type {ReactNode} from "react";
import Row from "@/components/UI/Row";
import Gutter from "@/components/UI/Gutter";

export default function NewLineRow({ children }: { children: ReactNode }) {
    return (
        <Row>
            <Gutter>+</Gutter>
            {children}
        </Row>
    );
}
