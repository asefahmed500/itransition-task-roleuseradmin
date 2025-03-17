import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";


export async function GET(request) {
    try {
        await dbConnect();
        const users = await User.find({} , {passwpord: 0});

        return new Response(JSON.stringify({success : true, users}) ,{
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })

    }
    catch (error) {
        return new Response(JSON.stringify({success : false, message: error.message}) ,{
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}


export async function PUT(request, { params }) {
    try {
      await dbConnect();
  
      const { userId } = params;
      const { isBlocked } = await request.json();
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isBlocked },
        { new: true }
      );
  
      if (!updatedUser) {
        return new Response(
          JSON.stringify({ success: false, message: "User not found" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
  
      return new Response(
        JSON.stringify({ success: true, user: updatedUser }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  export async function DELETE(request) {
    try {
      await dbConnect();
  
      // Delete all users from the database
      const result = await User.deleteMany({});
  
      // Check if any users were deleted
      if (result.deletedCount === 0) {
        return new Response(
          JSON.stringify({ success: false, message: "No users found to delete" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
  
      // Return success response
      return new Response(
        JSON.stringify({ success: true, message: `${result.deletedCount} users deleted` }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }