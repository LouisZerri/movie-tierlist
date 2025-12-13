<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[AsController]
class MovieYearsController {


    public function __construct(private MovieRepository $movieRepository){}

    #[Route('/api/movies/years', name: 'api_movie_years', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(array_map(fn($row) => $row['year'], $this->movieRepository->getAllYear()));
    }


}