from django.urls import path
from .views import (
    OverviewKPIView,
    FunnelAnalysisView,
    SearchAnalyticsView,
    ExperimentMetricsView,
    CategoryPerformanceView,
)

urlpatterns = [
    path('analytics/overview/', OverviewKPIView.as_view(), name='analytics_overview'),
    path('analytics/funnel/', FunnelAnalysisView.as_view(), name='analytics_funnel'),
    path('analytics/search/', SearchAnalyticsView.as_view(), name='analytics_search'),
    path('analytics/experiment/', ExperimentMetricsView.as_view(), name='analytics_experiment'),
    path('analytics/categories/', CategoryPerformanceView.as_view(), name='analytics_categories'),
]
