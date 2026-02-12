import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

const MyInput = ({
    value,
    label,
    placeholder,
    onChange,
    type = "text",
    className = "",
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            {label && (
                <label className="text-[13px] text-slate-800">{label}</label>
            )}

            <div className="input-box">
                <input
                    type={
                        type === "password"
                            ? showPassword
                                ? "text"
                                : "password"
                            : type
                    }
                    placeholder={placeholder}
                    className={`w-full bg-transparent outline-none ${className}`}
                    value={value}
                    onChange={onChange}
                />

                {type === "password" && (
                    showPassword ? (
                        <FaRegEye
                            size={22}
                            className="text-primary cursor-pointer"
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={22}
                            className="text-slate-400 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default MyInput

