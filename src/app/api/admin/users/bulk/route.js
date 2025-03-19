import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(request) {
    await dbConnect();

    try {
        const { userIds, action } = await request.json();

        const updatedUsers = await User.updateMany(
            { _id: { $in: userIds } },
            { isBlocked: action === 'block' }
        );

        return NextResponse.json({ success: true, users: updatedUsers }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    await dbConnect();

    try {
        const { userIds } = await request.json();
        await User.deleteMany({ _id: { $in: userIds } });
        return NextResponse.json({ success: true, message: 'Users deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
