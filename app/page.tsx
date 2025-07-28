"use client";

import React, { useState, useEffect } from "react";
import { calculateAllocation } from "../api/blockchain";

interface ContractData {
  totalAllocation: string;
  totalBalance: string;
  totalReservedUsed: string;
}

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 获取合约数据
  const fetchContractData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/contract-data");
      if (!response.ok) {
        throw new Error("获取数据失败");
      }
      const data = await response.json();
      setContractData(data);
    } catch (err) {
      setError("无法获取合约数据，请稍后重试");
      console.error("获取数据失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 计算额度
  const handleCalculate = () => {
    if (!userInput || !contractData) {
      setError("请输入金额并确保数据已加载");
      return;
    }

    try {
      const calculatedResult = calculateAllocation(
        userInput,
        contractData.totalAllocation,
        contractData.totalBalance,
        contractData.totalReservedUsed
      );
      setResult(calculatedResult);
      setError("");
    } catch (err) {
      setError("计算失败，请检查输入");
    }
  };

  // 格式化数字显示（移除小数点）
  const formatNumber = (num: string) => {
    try {
      const bigNum = BigInt(num);
      if (bigNum === BigInt(0)) return "0";

      // 转换为更易读的格式，假设精度为6位小数
      const divisor = BigInt(10 ** 6);
      const whole = bigNum / divisor;

      return whole.toString();
    } catch (error) {
      // 如果转换失败，直接返回原字符串
      return num;
    }
  };

  // 格式化计算结果（移除小数点）
  const formatResult = (result: string) => {
    try {
      const bigNum = BigInt(result);
      if (bigNum === BigInt(0)) return "0";

      // 对于计算结果，我们假设精度为6位小数
      const divisor = BigInt(10 ** 6);
      const whole = bigNum / divisor;

      return whole.toString();
    } catch (error) {
      // 如果转换失败，直接返回原字符串
      return result;
    }
  };

  // 格式化用户输入显示
  const formatUserInput = (input: string) => {
    if (!input) return "";
    try {
      const num = parseFloat(input);
      return num.toLocaleString();
    } catch {
      return input;
    }
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Plasma Unpurchased额度计算器
          </h1>
        </div>

        {/* 合约数据卡片 */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">合约数据</h2>
            <button
              onClick={fetchContractData}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loading ? "获取中..." : "刷新"}
            </button>
          </div>
          {loading ? (
            <div className="text-center py-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-1 text-sm text-gray-600">正在获取数据...</p>
            </div>
          ) : contractData ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 p-3 rounded">
                <h3 className="text-xs font-medium text-blue-800 mb-1">
                  总保证额度
                </h3>
                <p className="text-lg font-bold text-blue-900">
                  {formatNumber(contractData.totalAllocation)}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <h3 className="text-xs font-medium text-green-800 mb-1">
                  总提交金额
                </h3>
                <p className="text-lg font-bold text-green-900">
                  {formatNumber(contractData.totalBalance)}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <h3 className="text-xs font-medium text-orange-800 mb-1">
                  已使用额度
                </h3>
                <p className="text-lg font-bold text-orange-900">
                  {formatNumber(contractData.totalReservedUsed)}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h3 className="text-xs font-medium text-purple-800 mb-1">
                  Unpurchased额度
                </h3>
                <p className="text-lg font-bold text-purple-900">
                  {formatNumber(
                    (
                      +contractData.totalAllocation -
                      +contractData.totalReservedUsed
                    ).toString()
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={fetchContractData}
                className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                重新获取数据
              </button>
            </div>
          )}
        </div>

        {/* 计算器 */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">额度计算</h2>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="userInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                输入金额
              </label>
              <input
                type="number"
                id="userInput"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="请输入您要投入的金额"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {userInput && (
                <p className="text-xs text-gray-500 mt-1">
                  输入金额: {formatUserInput(userInput)}
                </p>
              )}
            </div>

            <button
              onClick={handleCalculate}
              disabled={!userInput || !contractData || loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              计算额度
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <h3 className="font-medium text-green-800 mb-1 text-sm">
                  计算结果
                </h3>
                <p className="text-2xl font-bold text-green-900">
                  {formatResult(result)} USD
                </p>
                <p className="text-xs text-green-600 mt-1">
                  您将获得的额度 ≈ {formatResult((+result / 0.05).toString())}{" "}
                  XPL
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 公式说明 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">计算公式</h2>
          <div className="bg-white rounded p-3 border">
            <p className="text-sm font-mono text-gray-800">
              用户输入 × (总保证额度 - 已使用额度) ÷ (总提交金额 - 已使用额度)
            </p>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="mt-6 text-center">
        <div className="author-info">
          Made by Freshguy
          <a href="https://x.com/pnl233" target="_blank">
            <svg
              width="16"
              height="16"
              viewBox="0 0 1200 1227"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                fill="#333333"
              />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
