import { after } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";

const MessageActions = findByProps("sendMessage");

let unpatch: (() => void) | undefined;

export const onLoad = () => {
    if (!MessageActions?.sendMessage) return;

    unpatch = after("sendMessage", MessageActions, (args) => {
        const [, message] = args;

        if (!message?.content) return;

        const text = message.content.trim();

        if (
            text.length &&
            !text.startsWith("/") &&
            !/[.!?…]$/.test(text)
        ) {
            message.content = text + ".";
        }
    });
};

export const onUnload = () => {
    unpatch?.();
};
