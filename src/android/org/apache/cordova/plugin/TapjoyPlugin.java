package org.apache.cordova.plugin;

import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewGroup.LayoutParams;
import android.view.WindowManager;
import android.widget.LinearLayout;

import com.tapjoy.TJError;
import com.tapjoy.TJPlacement;
import com.tapjoy.TJPlacementListener;
import com.tapjoy.TJAwardCurrencyListener;
import com.tapjoy.TJConnectListener;
import com.tapjoy.TapjoyLog;
import com.tapjoy.TJGetCurrencyBalanceListener;
import com.tapjoy.TJSpendCurrencyListener;
import com.tapjoy.TJVideoListener;
import com.tapjoy.TJActionRequest;



@SuppressWarnings("deprecation")
public class TapjoyPlugin extends CordovaPlugin implements TJPlacementListener
{
	public static final String TAG = "TapjoyPhoneGap";
	
	static Boolean result = null;
 	private static View displayAdView;
	private static LinearLayout linearLayout = null;
	private static int displayAdX;
	private static int displayAdY;
	
	// map plugin event to native event guid
	private static Hashtable<String, String> guidMap = null;
	
	private Hashtable<String, Object> connectFlags = null;
	
	@Override
	public boolean execute(String action, JSONArray data, final CallbackContext callbackContext) {
		
		Log.d("TapjoyPlugin", "Plugin Called: " + action);
		result = true;
		
		try
		{
			if (action.equals("setFlagKeyValue"))
			{
				if (connectFlags == null)
					connectFlags = new Hashtable<String, Object>();
				
				Object o = data.get(1);
				
				// data.get() returns a JSONObject for complex types. For now we assume this is a dictionary to be converted to hashtable (ex.segmentation params)
				if(o instanceof JSONObject){
					o = convertJSONToTable((JSONObject)o);
				}
				connectFlags.put(data.getString(0), o);
			}
			else
			if (action.equals("requestTapjoyConnect"))
			{
				final String sdkKey = data.getString(0);
				
				com.tapjoy.Tapjoy.connect(cordova.getActivity().getApplicationContext(), sdkKey, connectFlags, new TJConnectListener()
				{
					@Override
					public void onConnectFailure(){
						callbackContext.error("Connect Fail");
					}
					@Override
					public void onConnectSuccess(){
						callbackContext.success();
					}
				});
			}
			else
			if (action.equals("setUserID"))
			{
				com.tapjoy.Tapjoy.setUserID(data.getString(0));
				callbackContext.success();
			}
			else
			if (action.equals("setDebugEnabled"))
			{
				com.tapjoy.Tapjoy.setDebugEnabled(Boolean.parseBoolean(data.getString(0)));
				callbackContext.success();
			}
			//--------------------------------------------------------------------------------
			// PPA
			//--------------------------------------------------------------------------------
			else
			if (action.equals("actionComplete"))
			{
				com.tapjoy.Tapjoy.actionComplete(data.getString(0));
				callbackContext.success();
			}
			//--------------------------------------------------------------------------------
			// OFFERS RELATED
			//--------------------------------------------------------------------------------
			else
			if (action.equals("getTapPoints"))
			{
				com.tapjoy.Tapjoy.getCurrencyBalance(new TJGetCurrencyBalanceListener()
				{
					@Override
					public void onGetCurrencyBalanceResponseFailure(String error)
					{
						callbackContext.error(error);
					}
					
					@Override
					public void onGetCurrencyBalanceResponse(String currencyName, int pointTotal)
					{
						callbackContext.success(Integer.toString(pointTotal));
					}
				});
			}
			else
			if (action.equals("spendTapPoints"))
			{
				com.tapjoy.Tapjoy.spendCurrency(data.getInt(0), new TJSpendCurrencyListener()
				{
					@Override
					public void onSpendCurrencyResponseFailure(String error)
					{
						callbackContext.error(error);
					}
					
					@Override
					public void onSpendCurrencyResponse(String currencyName, int pointTotal)
					{
						callbackContext.success(Integer.toString(pointTotal));
					}
				});
			}
			else
			if (action.equals("awardTapPoints"))
			{
				com.tapjoy.Tapjoy.awardCurrency(data.getInt(0), new TJAwardCurrencyListener()
				{					
					@Override
					public void onAwardCurrencyResponseFailure(String error)
					{
						callbackContext.error(error);
					}
					
					@Override
					public void onAwardCurrencyResponse(String currencyName, int pointTotal)
					{
						callbackContext.success(Integer.toString(pointTotal));
					}
				});
			}
			//--------------------------------------------------------------------------------
			// VIDEO RELATED
			//--------------------------------------------------------------------------------
			else
			if (action.equals("setVideoNotifier"))
			{
				com.tapjoy.Tapjoy.setVideoListener(new TJVideoListener()
				{
					
					@Override
					public void onVideoStart()
					{
						callbackContext.success();
					}
					
					@Override
					public void onVideoError(int statusCode)
					{
						callbackContext.error(statusCode);
					}
					
					@Override
					public void onVideoComplete()
					{
						callbackContext.success();
					}
				});
			}
			//--------------------------------------------------------------------------------
			// EVENTS FRAMEWORK
			//--------------------------------------------------------------------------------
			else
			if (action.equals("createEvent"))
			{
				final String guid = data.getString(0);
				final String eventName = data.getString(1);
				final String eventParam;
				
				if(!data.isNull(2))
				{
					eventParam = data.getString(2);
				}
				else{
					eventParam = null;
				}
				
		        cordova.getActivity().runOnUiThread(new Runnable() {
		            public void run() {
						if(guidMap == null)
							guidMap = new Hashtable<String, String>();
						
						TJPlacement myEvent = new TJPlacement(cordova.getActivity(), eventName, TapjoyPlugin.this);
						
						// Key = Android guid, Value = PhoneGap guid
						guidMap.put(myEvent.getGUID(), guid);
						
						callbackContext.success();
		            }
		        });
			}
			//--------------------------------------------------------------------------------
			//--------------------------------------------------------------------------------
			else 
			{
				result = false;
			}
		}
		catch (Exception e)
		{
			Log.d("Tapjoy Plugin", "exception: "+ e.toString());
			result = false;
			callbackContext.error(e.toString());
		}
		
		Log.d("Tapjoy Plugin", "result status: " + result);
		
		return result;
	}
	
	private void updateResultsInUi() 
	{
		try
		{
			// Get the screen size.
			WindowManager mW = (WindowManager)cordova.getActivity().getSystemService(Context.WINDOW_SERVICE);
			int screenWidth = mW.getDefaultDisplay().getWidth();
			int screenHeight = mW.getDefaultDisplay().getHeight();
			
			// Null check.
			if (displayAdView == null)
			{
				return;
			}
					
			int ad_width = displayAdView.getLayoutParams().width;
			int ad_height = displayAdView.getLayoutParams().height;
			
			// Resize display ad if it's too big.
			if (screenWidth < ad_width)
			{
				// Using screen width, but substitute for the any width.
				int desired_width = screenWidth;

				int scale;
				Double val = Double.valueOf(desired_width) / Double.valueOf(ad_width);
				val = val * 100d;
				scale = val.intValue();

				((android.webkit.WebView) (displayAdView)).getSettings().setSupportZoom(true);
				((android.webkit.WebView) (displayAdView)).setPadding(0, 0, 0, 0);
				((android.webkit.WebView) (displayAdView)).setVerticalScrollBarEnabled(false);
				((android.webkit.WebView) (displayAdView)).setHorizontalScrollBarEnabled(false);
				// ((WebView)(displayAdView)).getSettings().setLoadWithOverviewMode(true);
				((android.webkit.WebView) (displayAdView)).setInitialScale(scale);
			
				// Resize display ad to desired width and keep aspect ratio.
				LayoutParams layout = new LayoutParams(desired_width, (desired_width*ad_height)/ad_width);
				displayAdView.setLayoutParams(layout);
			}
			
			if (linearLayout != null)
			{
				linearLayout.removeAllViews();
			}
			
			linearLayout = new LinearLayout(cordova.getActivity());
			linearLayout.setLayoutParams(new ViewGroup.LayoutParams(screenWidth, screenHeight));
			
			// Use padding to set the x/y coordinates.
			linearLayout.setPadding(displayAdX, displayAdY, 0, 0);
			linearLayout.addView(displayAdView);
			
			cordova.getActivity().getWindow().addContentView(linearLayout, new ViewGroup.LayoutParams(screenWidth, screenHeight));
		}
		catch (Exception e)
		{
			Log.e("TapjoyPluginActivity", "exception adding display ad: " + e.toString());
		}
	}

	//----------------------------------------------------------------------
	// EVENTS Interface
	//----------------------------------------------------------------------	
	public void onRequestFailure(TJPlacement event, TJError error)
	{
		TapjoyLog.i(TAG, "sendEventFail");

		webView.sendJavascript("Tapjoy.sendEventFail('" + guidMap.get(event.getGUID()) + "', '"+ error.message + "');");
	}
	
	public void onRequestSuccess(TJPlacement event)
	{
	}

	public void onContentShow(TJPlacement event)
	{
		TapjoyLog.i(TAG, "contentDidShow");
		webView.sendJavascript("Tapjoy.eventContentDidAppear('" + guidMap.get(event.getGUID()) + "');");
	}
	
	public void onContentDismiss(TJPlacement event)
	{
		TapjoyLog.i(TAG, "contentDidDisappear");
		webView.sendJavascript("Tapjoy.eventContentDidDisappear('" + guidMap.get(event.getGUID()) + "');");
	}
	public void onContentReady(TJPlacement event)
	{
	}

	public void onPurchaseRequest(TJPlacement event, TJActionRequest request, String productId)
	{
	}

	public void onRewardRequest(TJPlacement event, TJActionRequest request, String itemId, int quantity)
	{
	}

	private static String getAndroidGuid(String phoneGapGuid)
	{
		String androidGuid = null;

		if (guidMap != null)
		{
			for(Map.Entry<String, String> entry: guidMap.entrySet())
			{
				if (entry.getValue().equals(phoneGapGuid))
					androidGuid = entry.getKey();
			}
		}
		else
		{
			TapjoyLog.e(TAG, "Cannot get the AndroidGuid, the guidmap is null");
		}

		return androidGuid;
	}
	
	private Hashtable<String, Object> convertJSONToTable(JSONObject obj)
	{
		Hashtable<String, Object> newTable = new Hashtable<String, Object>();
		Iterator i = obj.keys();
		while(i.hasNext())
		{
			try
			{
				String key = (String)i.next();
				newTable.put(key, obj.get(key));
			}
			catch(JSONException e)
			{
				e.printStackTrace();
			}
		}
		return newTable;
	}
}
