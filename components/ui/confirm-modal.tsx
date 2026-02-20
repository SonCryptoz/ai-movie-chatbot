"use client";

type Props = {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    open,
    title = "Confirm action",
    description = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: Props) {
    if (!open) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4 opacity-80">{description}</p>

                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={onCancel}>
                        {cancelText}
                    </button>

                    <button className="btn btn-error" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>

            {/* backdrop */}
            <div className="modal-backdrop" onClick={onCancel} />
        </div>
    );
};
