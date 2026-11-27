import type {ReactNode} from "react";
import Row from "../../UI/Row";
import Gutter from "../../UI/Gutter";

export default function NewLineRow({ children }: { children: ReactNode }) {
    return (
        <Row>
            <Gutter>+</Gutter>
            {children}
        </Row>
    );
}
