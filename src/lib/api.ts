import axios from "axios";
import {CodeLine, CodeLineList} from "@/types/line";

const http = axios.create({ baseURL: "/api/v1" });

// Unwrap API error from axios's bs
http.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(new Error(err.response?.data?.error ?? err.message)),
);

export const getLines = async () => {

    const response = await http.get<CodeLineList>("/lines");
    return response.data;

}


export const editLine = async (line_id: number, new_text: string) => {

    const response = await http.post<CodeLine>("/lines/edit", {
        line_id,
        new_text
    });
    return response.data;

}

//note: line_id_above undef is append, null = new top
export const addLine = async (new_text: string, line_id_above?: number | null) => {

    const response = await http.post<CodeLine>("/lines/add", {
        new_text,
        line_id_above
    });
    return response.data;

}

export const removeLine = async (line_id: number) => {

    const response = await http.post<CodeLine>("/lines/remove", {
        line_id
    });
    return response.data;

}