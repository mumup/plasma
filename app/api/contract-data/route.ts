import { NextResponse } from 'next/server';
import { getContractData } from '../../../api/blockchain';

export async function GET() {
  try {
    const data = await getContractData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '获取合约数据失败' },
      { status: 500 }
    );
  }
} 