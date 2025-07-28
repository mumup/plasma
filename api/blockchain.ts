import { ethers } from 'ethers';
import abi from '../abi.json';

// 合约地址
const CONTRACT_ADDRESS = '0x4d058e2849a7bab450b8eb3c9941064e5abec551';

// 创建合约实例
const createContract = () => {
  // 使用公共RPC端点
  const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
  return new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
};

// 获取合约数据
export const getContractData = async () => {
  try {
    const contract = createContract();
    
    // 并行获取所有数据
    const [totalAllocation, totalBalance, totalReservedUsed] = await Promise.all([
      contract.totalAllocation(),
      contract.totalBalance(),
      contract.totalReservedUsed(),
    ]);

    return {
      totalAllocation: totalAllocation.toString(),
      totalBalance: totalBalance.toString(),
      totalReservedUsed: totalReservedUsed.toString(),
    };
  } catch (error) {
    console.error('获取合约数据失败:', error);
    throw new Error('无法获取合约数据');
  }
};

// 将字符串转换为BigInt，处理小数点
const parseToBigInt = (value: string): bigint => {
  // 如果包含小数点，需要处理精度
  if (value.includes('.')) {
    const [whole, decimal] = value.split('.');
    // 假设精度为6位小数，将小数点后的数字补齐到6位
    const paddedDecimal = decimal.padEnd(6, '0').substring(0, 6);
    return BigInt(whole + paddedDecimal);
  }
  return BigInt(value);
};

// 转换用户输入值，使其与合约数据精度一致
const convertUserInput = (userInput: string): bigint => {
  // 用户输入的是普通数字，需要转换为与合约数据相同的精度
  // 假设合约数据精度为6位小数，所以用户输入需要乘以 10^6
  const inputNum = parseFloat(userInput);
  const precision = BigInt(10 ** 6);
  return BigInt(Math.floor(inputNum * Number(precision)));
};

// 计算超募额度
export const calculateAllocation = (
  userInput: string,
  totalAllocation: string,
  totalBalance: string,
  totalReservedUsed: string
): string => {
  try {
    const input = convertUserInput(userInput);
    const allocation = parseToBigInt(totalAllocation);
    const balance = parseToBigInt(totalBalance);
    const reserved = parseToBigInt(totalReservedUsed);

    // 计算可用额度
    const availableAllocation = allocation - reserved;
    const availableBalance = balance - reserved;

    if (availableBalance === BigInt(0)) {
      return '0';
    }

    // 应用公式: 用户输入 * (总保证额度 - 已使用额度) / (总筹集金额 - 已使用额度)
    const result = (input * availableAllocation) / availableBalance;
    
    return result.toString();
  } catch (error) {
    console.error('计算失败:', error);
    return '0';
  }
}; 