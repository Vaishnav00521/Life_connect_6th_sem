package com.lifeconnect.LifeConnect;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    // 1. The Core Geospatial Engine
    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:searchLat)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:searchLng)) + " +
            "sin(radians(:searchLat)) * sin(radians(latitude)))) AS calculated_distance " +
            "FROM donors " +
            "WHERE (:bloodGroup IS NULL OR :bloodGroup = '' OR blood_group = :bloodGroup) " +
            "HAVING calculated_distance < :maxRadius " +
            "ORDER BY calculated_distance ASC",
            nativeQuery = true)
    List<Donor> findNearestDonors(
            @Param("bloodGroup") String bloodGroup,
            @Param("searchLat") Double searchLat,
            @Param("searchLng") Double searchLng,
            @Param("maxRadius") Double maxRadius);

    // 2. Live Ticker Query
    List<Donor> findTop5ByOrderByIdDesc();

    // 3. NEW: Analytics Engine (Groups and counts blood types for the Dashboard)
    @Query("SELECT d.bloodGroup, COUNT(d) FROM Donor d GROUP BY d.bloodGroup")
    List<Object[]> countDonorsByBloodGroup();
}