package com.example.schoolapp; // <-- make sure this matches your app's package

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.ImageView;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DELAY = 2000; // 2 seconds

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash); // We will create this layout next!

        ImageView logo = findViewById(R.id.splash_logo);

        // Fade-in animation
        Animation fadeIn = new AlphaAnimation(0, 1);
        fadeIn.setDuration(1500);
        logo.startAnimation(fadeIn);

        // Delay then move to MainActivity
        new Handler().postDelayed(() -> {
            startActivity(new Intent(SplashActivity.this, MainActivity.class));
            finish(); // Close SplashActivity
        }, SPLASH_DELAY);
    }
}